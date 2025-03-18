const AppError = require('../utils/errorHandler');

// 开发环境错误处理
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// 生产环境错误处理
const sendErrorProd = (err, res) => {
  // 可操作的、可信的错误：发送消息给客户端
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // 编程错误或未知错误：不泄露错误详情
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: '服务器内部错误'
    });
  }
};

// 处理MySQL错误
const handleMySQLError = (err) => {
  if (err.code === 'ER_DUP_ENTRY') {
    return new AppError('数据已存在，请勿重复添加', 400);
  }
  return new AppError('数据库操作失败', 500);
};

// 处理JWT错误
const handleJWTError = () => new AppError('无效的令牌，请重新登录', 401);
const handleJWTExpiredError = () => new AppError('令牌已过期，请重新登录', 401);

// 全局错误处理中间件
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.code && (err.code.startsWith('ER_') || err.errno)) error = handleMySQLError(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
}; 