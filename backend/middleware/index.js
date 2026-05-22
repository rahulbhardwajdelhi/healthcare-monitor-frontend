// Logging middleware
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
}

// 404 handler
function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
}

module.exports = { requestLogger, errorHandler, notFoundHandler };
