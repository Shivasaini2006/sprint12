/**
 * Custom Error Class for operational API errors.
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global centralized Express error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error('ERROR LOG 🔴:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((el) => el.message).join('. ');
    return res.status(400).json({
      status: 'fail',
      message: `Invalid input data: ${message}`
    });
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    return res.status(400).json({
      status: 'fail',
      message: `Duplicate field value: ${value}. Please use another value!`
    });
  }

  // Handle Mongoose Cast Error (e.g. invalid object ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'fail',
      message: `Invalid ${err.path}: ${err.value}.`
    });
  }

  // Handle Multer upload limits/errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'fail',
      message: 'File size limit exceeded. Maximum size permitted is 5MB.'
    });
  }

  if (err.message && err.message.startsWith('MulterError')) {
    return res.status(400).json({
      status: 'fail',
      message: `Upload error: ${err.message}`
    });
  }

  // Production response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.isOperational ? err.message : 'Something went wrong on the server.'
  });
};

export default errorHandler;
