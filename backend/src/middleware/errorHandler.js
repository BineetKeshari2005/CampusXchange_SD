/**
 * SOLID - SRP: This middleware has ONE job — catch and format all errors globally.
 * Instead of try/catch in every route, all errors flow here via next(err).
 *
 * OOP: Encapsulation — error formatting logic is in one place.
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Global error handler middleware — must have 4 params for Express to treat it as error handler
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : "Internal Server Error",
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export { AppError, globalErrorHandler };
