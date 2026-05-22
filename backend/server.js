const express = require('express');
require('dotenv').config();

const patientsRouter = require('./routes/patients');
const { requestLogger, errorHandler, notFoundHandler } = require('./middleware/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/patients', patientsRouter);

// Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Healthcare Monitor API running on port ${PORT}`);
});
