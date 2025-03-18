const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'fail', message: '未授权访问' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ status: 'fail', message: '未提供令牌' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: '令牌无效或已过期' });
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
