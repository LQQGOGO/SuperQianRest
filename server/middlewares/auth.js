const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');
const jwtConfig = require('../config/jwt');

// 验证Token中间件
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "未提供认证令牌");
    }

    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      req.user = decoded;
      next();
    } catch (err) {
      throw new ApiError(403, "无效的令牌");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateToken
}; 