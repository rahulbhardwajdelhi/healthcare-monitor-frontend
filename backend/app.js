const express = require('express');

const patientsRouter = require('./routes/patients');
const { requestLogger, errorHandler, notFoundHandler } = require('./middleware/index');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      environment: process.env.NODE_ENV || 'development',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/patients', patientsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };