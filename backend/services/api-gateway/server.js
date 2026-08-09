require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Microservice Route Mappings
const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
  theme: process.env.THEME_SERVICE_URL || 'http://localhost:5002',
  booking: process.env.BOOKING_SERVICE_URL || 'http://localhost:5003',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5004',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5005',
};

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS Policy restriction'), false);
  },
  credentials: true,
}));

app.use(compression());
app.use(helmet({ contentSecurityPolicy: false }));

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// Request Correlation ID tracking
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

morgan.token('id', (req) => req.id);
app.use(morgan(':id :remote-addr - :method :url HTTP/:http-version :status :response-time ms'));

// Generic HTTP Proxy to Downstream Microservices
const proxyRequest = (targetBaseUrl, req, res) => {
  const targetUrl = new URL(req.url, targetBaseUrl);
  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port,
    path: targetUrl.pathname + targetUrl.search,
    method: req.method,
    headers: {
      ...req.headers,
      'x-request-id': req.id,
      host: targetUrl.host,
    },
  };

  const proxy = http.request(options, (targetRes) => {
    res.writeHead(targetRes.statusCode, targetRes.headers);
    targetRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    console.error(`[API Gateway] Error proxying to ${targetBaseUrl}:`, err.message);
    if (!res.headersSent) {
      res.status(503).json({ error: 'Downstream microservice unavailable', service: targetBaseUrl });
    }
  });

  req.pipe(proxy, { end: true });
};

// Gateway Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const serviceStatuses = {};
  await Promise.all(
    Object.entries(SERVICES).map(async ([name, url]) => {
      try {
        const response = await fetch(`${url}/health`);
        serviceStatuses[name] = response.ok ? 'HEALTHY' : 'DEGRADED';
      } catch (err) {
        serviceStatuses[name] = 'UNREACHABLE';
      }
    })
  );

  res.json({
    gateway: 'UP',
    timestamp: new Date().toISOString(),
    services: serviceStatuses,
  });
});

// Service Routing Declarations
app.use('/api/auth', (req, res) => proxyRequest(SERVICES.auth, req, res));
app.use(['/api/themes', '/api/addons'], (req, res) => proxyRequest(SERVICES.theme, req, res));
app.use('/api/bookings', (req, res) => proxyRequest(SERVICES.booking, req, res));
app.use('/api/payments', (req, res) => proxyRequest(SERVICES.payment, req, res));
app.use('/api/notifications', (req, res) => proxyRequest(SERVICES.notification, req, res));

// Serve Frontend Build Artifacts in Production
const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error('[API Gateway Error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🌐 API Gateway active on port ${PORT}`);
});
