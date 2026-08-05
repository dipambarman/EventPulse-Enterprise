require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');

// Startup Environment Audit
const validateEnv = require('./config/envCheck');
validateEnv();

// Import routes
const themeRoutes = require('./routes/themeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const healthRoute = require('./routes/healthRoute');
const addonController = require('./controllers/addonController');
const analyticsController = require('./controllers/analyticsController');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Performance & Security Middlewares
app.use(compression());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(helmet());
app.use(cookieParser());
app.use(morgan('combined')); // HTTP request logging

// CSRF Protection Middleware
const csrfMiddleware = (req, res, next) => {
  if (req.method === 'GET' || req.method === 'OPTIONS' || req.method === 'HEAD') return next();
  if (req.path === '/api/payments/razorpay/webhook') return next(); // Webhooks are authenticated via signature
  if (req.path === '/api/health') return next();
  
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  
  const isValidOrigin = origin ? allowedOrigins.includes(origin) : false;
  const isValidReferer = referer ? allowedOrigins.some(o => referer.startsWith(o)) : false;

  if (isValidOrigin || isValidReferer) {
    return next();
  }
  return res.status(403).json({ error: 'CSRF validation failed' });
};
app.use(csrfMiddleware);

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Generate a random secret if not provided to prevent hardcoded secret vulnerability
const crypto = require('crypto');
const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');

// Session middleware setup
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Health Check Route
app.use('/api/health', healthRoute);

// Application API Routes
app.use('/api/themes', themeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authLimiter, authRoutes);

// Additional Endpoints
const authMiddleware = require('./middleware/authMiddleware');
app.get('/api/addons', authMiddleware, addonController.getAllAddOns);
app.get('/api/addons/:id', authMiddleware, addonController.getAddOnById);
app.get('/api/analytics', authMiddleware, analyticsController.getExecutiveAnalytics);

// Serve frontend static files in production
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendPath));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global Centralized Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 EventPulse API running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});
