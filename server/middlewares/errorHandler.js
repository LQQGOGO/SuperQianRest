const logger = require('../utils/logger');

// 自定义API错误类
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  let error = err;
  
  // 如果不是ApiError实例，转换为ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || '服务器内部错误';
    error = new ApiError(statusCode, message, false);
  }
  
  // 记录错误日志
  logger.error(`${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // 开发环境下返回详细错误信息
  if (process.env.NODE_ENV === 'development') {
    return res.status(error.statusCode).json({
      message: error.message,
      stack: error.stack,
      status: error.statusCode
    });
  }
  
  // 生产环境下返回简洁错误信息
  return res.status(error.statusCode).json({
    message: error.isOperational ? error.message : '服务器内部错误',
    status: error.statusCode
  });
};

module.exports = {
  ApiError,
  errorHandler
}; 