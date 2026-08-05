const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const memoryUsage = process.memoryUsage();
  let dbStatus = 'healthy';

  try {
    await pool.execute('SELECT 1');
  } catch (err) {
    dbStatus = 'degraded_or_mock';
  }

  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    memory: {
      rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024)
    }
  });
});

module.exports = router;
