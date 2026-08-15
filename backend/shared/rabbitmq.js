const amqp = require('amqplib');

let connection = null;
let channel = null;

/**
 * Connect to RabbitMQ with exponential backoff retry.
 * Handles the Docker startup race condition where RabbitMQ
 * may not be ready when the service container starts.
 */
async function connectWithRetry(url, maxRetries = 10) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      connection = await amqp.connect(url);
      channel = await connection.createChannel();

      // Ensure the shared topic exchange exists
      await channel.assertExchange('eventpulse.events', 'topic', { durable: true });

      console.log(`[RabbitMQ] ✅ Connected successfully (attempt ${attempt})`);

      // Reconnect on unexpected close
      connection.on('close', () => {
        console.warn('[RabbitMQ] Connection closed. Reconnecting in 5s...');
        setTimeout(() => connectWithRetry(url, maxRetries), 5000);
      });

      connection.on('error', (err) => {
        console.error('[RabbitMQ] Connection error:', err.message);
      });

      return channel;
    } catch (err) {
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
      console.warn(`[RabbitMQ] Connection attempt ${attempt}/${maxRetries} failed: ${err.message}. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  console.error('[RabbitMQ] ❌ Failed to connect after all retries. Service will operate without message queue.');
  return null;
}

/**
 * Publish an event to the topic exchange.
 * @param {string} routingKey - e.g. 'booking.created', 'payment.verified'
 * @param {object} payload - JSON-serializable event data
 */
function publishEvent(routingKey, payload) {
  if (!channel) {
    console.warn(`[RabbitMQ] Cannot publish "${routingKey}" — no channel available.`);
    return false;
  }

  const message = Buffer.from(JSON.stringify(payload));
  channel.publish('eventpulse.events', routingKey, message, {
    persistent: true,
    contentType: 'application/json',
    timestamp: Date.now()
  });

  console.log(`[RabbitMQ] 📤 Published "${routingKey}":`, JSON.stringify(payload).substring(0, 120));
  return true;
}

/**
 * Subscribe to events from the topic exchange.
 * @param {string} queueName - durable queue name, e.g. 'notification.booking_created'
 * @param {string} routingKey - binding key, e.g. 'booking.created'
 * @param {function} handler - async function(parsedMessage) to process each message
 */
async function consumeEvent(queueName, routingKey, handler) {
  if (!channel) {
    console.warn(`[RabbitMQ] Cannot consume "${queueName}" — no channel available.`);
    return;
  }

  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, 'eventpulse.events', routingKey);
  // Process one message at a time per consumer for reliability
  await channel.prefetch(1);

  channel.consume(queueName, async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      console.log(`[RabbitMQ] 📥 Consumed "${routingKey}" from "${queueName}":`, JSON.stringify(payload).substring(0, 120));
      await handler(payload);
      channel.ack(msg);
    } catch (err) {
      console.error(`[RabbitMQ] ❌ Error processing message from "${queueName}":`, err.message);
      // Negative ack — requeue once, then dead-letter on second failure
      channel.nack(msg, false, !msg.fields.redelivered);
    }
  });

  console.log(`[RabbitMQ] 👂 Listening on queue "${queueName}" for routing key "${routingKey}"`);
}

/**
 * Get the current channel (for health checks etc.)
 */
function getChannel() {
  return channel;
}

module.exports = {
  connectWithRetry,
  publishEvent,
  consumeEvent,
  getChannel
};
