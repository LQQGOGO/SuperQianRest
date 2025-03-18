const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
  console.log('认证中间件收到请求:', req.path);
  console.log('请求头:', JSON.stringify(req.headers));
  
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('认证失败: 无效的Authorization头');
      return res.status(401).json({ status: 'fail', message: '未授权访问' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('认证失败: 无令牌');
      return res.status(401).json({ status: 'fail', message: '未提供令牌' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log('认证成功, 用户:', decoded.username || decoded.id);
      next();
    } catch (error) {
      console.log('认证失败: 令牌验证错误', error.message);
      return res.status(401).json({ status: 'fail', message: '令牌无效或已过期' });
    }
  } catch (error) {
    console.log('认证中间件错误:', error);
    return res.status(401).json({ status: 'fail', message: '认证过程中发生错误' });
  }
};

// 检查是否为管理员
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ status: 'fail', message: '需要管理员权限' });
  }
};

// 检查是否为员工或管理员
const isStaffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ status: 'fail', message: '需要员工或管理员权限' });
  }
};

module.exports = { auth, isAdmin, isStaffOrAdmin };
