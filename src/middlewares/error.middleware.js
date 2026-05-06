const errorMiddleware = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  const payload = {
    message,
  };

  if (error.code) {
    payload.code = error.code;
  }

  if (error.details) {
    payload.details = error.details;
  }

  return res.status(statusCode).json(payload);
};

module.exports = errorMiddleware;
