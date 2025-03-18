/**
 * 认证中间件示例
 */
const jwt = require('jsonwebtoken');
const AppError = require('../utils/errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = async (req, res, next) => {
  try {
    // 获取请求头中的 token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('未提供访问令牌', 401));
    }
    
    const token = authHeader.split(' ')[1];
    
    // 验证 token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 将用户信息添加到请求对象中
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('无效的访问令牌', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('访问令牌已过期', 401));
    }
    next(error);
  }
};

// 权限检查中间件
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions.includes(permission)) {
      return next(new AppError('没有权限执行此操作', 403));
    }
    next();
  };
};

module.exports = { authMiddleware, checkPermission }; 