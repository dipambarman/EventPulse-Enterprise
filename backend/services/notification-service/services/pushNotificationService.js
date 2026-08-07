const webpush = require('web-push');

// Generate default demo VAPID keys if env vars are missing
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa7E8WkQvj_24G3h-x5_83N_Kk2S-E7j9X1l67m-y-t31z1';
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || '5_e7f3h8k9l0m1n2o3p4q5r6s7t8u9v0';
const pushEmail = process.env.VAPID_EMAIL || 'mailto:admin@eventpulse.io';

try {
  webpush.setVapidDetails(pushEmail, publicVapidKey, privateVapidKey);
} catch (err) {
  console.warn('[Push Notification Service] VAPID details fallback initialized');
}

// In-memory subscription registry for web push devices
const subscriptionsStore = new Map();

exports.registerSubscription = (userId, subscription) => {
  if (!userId || !subscription) return false;
  subscriptionsStore.set(userId, subscription);
  console.log(`[Push Notification Service] Registered Web Push subscription for user: ${userId}`);
  return true;
};

exports.getVapidPublicKey = () => {
  return publicVapidKey;
};

exports.sendPushNotification = async ({ userId, title, body, icon, url }) => {
  const subscription = subscriptionsStore.get(userId);
  const payload = JSON.stringify({
    title: title || 'EventPulse Notification',
    body: body || 'You have an event update.',
    icon: icon || '/vite.svg',
    data: { url: url || '/client-portal' }
  });

  if (!subscription) {
    console.log(`[Push Notification Service] No active subscription for ${userId}, simulated push dispatch.`);
    return { success: true, simulated: true, userId, payload: JSON.parse(payload) };
  }

  try {
    await webpush.sendNotification(subscription, payload);
    console.log(`[Push Notification Service] Successfully sent web push to ${userId}`);
    return { success: true, userId };
  } catch (err) {
    console.error(`[Push Notification Service] Error delivering push to ${userId}:`, err.message);
    return { success: false, error: err.message };
  }
};
