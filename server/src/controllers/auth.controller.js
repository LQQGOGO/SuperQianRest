const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const AppError = require('../utils/errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const RESET_CODE = process.env.RESET_CODE || 'RESET_677_GOGO_2024';

// 登录
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new AppError('请提供用户名和密码', 400));
    }

    // 查询用户
    const [users] = await pool.query(
      'SELECT id, username, password, role FROM users WHERE username = ? AND status = 1',
      [username]
    );

    if (users.length === 0) {
      return next(new AppError('用户名或密码错误', 401));
    }

    const user = users[0];

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError('用户名或密码错误', 401));
    }

    // 获取用户权限
    const [permissions] = await pool.query(
      'SELECT permission_code FROM user_permissions WHERE user_id = ?',
      [user.id]
    );

    const permissionList = permissions.map(p => p.permission_code);

    // 生成 JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        permissions: permissionList
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      adminInfo: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取当前管理员信息
exports.getAdminInfo = async (req, res, next) => {
  try {
    // 用户信息已在 authMiddleware 中添加到 req 对象
    const { id, username, role, permissions } = req.user;

    res.status(200).json({
      id,
      username,
      role,
      permissions
    });
  } catch (error) {
    next(error);
  }
};

// 重置管理员密码
exports.resetAdminPassword = async (req, res, next) => {
  try {
    const { username, newPassword, resetCode } = req.body;

    if (!username || !newPassword || !resetCode) {
      return next(new AppError('请提供所有必要信息', 400));
    }

    // 验证重置码
    if (resetCode !== RESET_CODE) {
      return next(new AppError('重置码无效', 401));
    }

    // 查询用户是否存在
    const [users] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return next(new AppError('用户不存在', 404));
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await pool.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, username]
    );

    res.status(200).json({
      message: '管理员密码重置成功',
      username
    });
  } catch (error) {
    next(error);
  }
}; 