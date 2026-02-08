const mongoose = require("mongoose");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  if (
    process.env.NODE_ENV !== "test" &&
    statusCode >= 500
  ) {
    console.error(err);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Validation error",
      errors: Object.fromEntries(
        Object.entries(err.errors || {}).map(([key, value]) => [
          key,
          value.message,
        ])
      ),
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      message: `Invalid ${err.path || "id"}`,
    });
  }

  if (err.statusCode && err.statusCode < 500) {
    return res.status(statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
