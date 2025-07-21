/**
 * Error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error("Error occurred:", err);

  // Default error
  let error = {
    message: "Internal server error",
    status: 500,
  };

  // Handle specific error types
  if (err.code === "ER_DUP_ENTRY") {
    error.message = "Username already exists";
    error.status = 409;
  } else if (err.code === "ECONNREFUSED") {
    error.message = "Database connection failed";
    error.status = 503;
  } else if (err.message) {
    error.message = err.message;
  }

  res.status(error.status).json({ error: error.message });
}

/**
 * 404 Not Found middleware
 */
function notFound(req, res) {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
}

/**
 * Request logging middleware
 */
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  next();
}

module.exports = {
  errorHandler,
  notFound,
  requestLogger,
};
