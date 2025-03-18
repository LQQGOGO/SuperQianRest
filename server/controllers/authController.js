const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../models/db');
const jwtConfig = require('../config/jwt');
const { ApiError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

// 用户登录
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // 查询用户
    const [users] = await pool.query(
      'SELECT id, username, password, role FROM users WHERE username = ? AND (role = "admin" OR role = "staff")',
      [username]
    );
    
    if (users.length === 0) {
      throw new ApiError(401, '用户名或密码错误');
    }
    
    const user = users[0];
    
    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, '用户名或密码错误');
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    
    logger.info(`用户 ${username} 登录成功`);
    
    // 返回令牌和用户信息
    res.json({
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

// 获取当前用户信息
const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 查询用户信息
    const [users] = await pool.query(
      'SELECT id, username, role FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      throw new ApiError(404, '用户不存在');
    }
    
    const user = users[0];
    
    // 根据角色分配权限
    let permissions = [];
    if (user.role === 'admin') {
      permissions = [
        'dashboard:view', 'menu:view', 'menu:edit', 'menu:add', 'menu:delete',
        'order:view', 'order:edit', 'order:add', 'order:delete',
        'user:view', 'user:edit', 'user:add', 'user:delete',
        'report:view', 'setting:view', 'setting:edit'
      ];
    } else if (user.role === 'staff') {
      permissions = [
        'dashboard:view', 'menu:view', 
        'order:view', 'order:edit',
        'user:view'
      ];
    }
    
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      permissions
    });
  } catch (error) {
    next(error);
  }
};

// 重置密码
const resetPassword = async (req, res, next) => {
  try {
    const { username, newPassword, resetCode } = req.body;
    
    // 验证重置码（在实际应用中，这应该是一个更复杂的验证过程）
    if (resetCode !== "RESET_677_GOGO_2024") {
      throw new ApiError(400, "无效的重置码");
    }
    
    // 查询用户
    const [users] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      throw new ApiError(404, "用户不存在");
    }
    
    // 哈希新密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // 更新密码
    await pool.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, username]
    );
    
    logger.info(`用户 ${username} 密码已重置`);
    
    res.json({
      message: "管理员密码重置成功",
      username
    });
  } catch (error) {
    next(error);
  }
};

// 忘记密码
const forgotPassword = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    
    // 查询用户
    const [users] = await pool.query(
      'SELECT id, email FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      // 为了安全，即使用户不存在也返回成功
      return res.json({
        message: "如果该用户存在，重置密码的说明已发送到关联的电子邮件地址"
      });
    }
    
    const user = users[0];
    
    // 验证电子邮件（如果提供）
    if (email && user.email !== email) {
      return res.json({
        message: "如果该用户存在，重置密码的说明已发送到关联的电子邮件地址"
      });
    }
    
    // 在实际应用中，这里应该生成一个重置令牌并发送电子邮件
    // 为了演示，我们只记录一条消息
    logger.info(`用户 ${username} 请求了密码重置`);
    
    res.json({
      message: "如果该用户存在，重置密码的说明已发送到关联的电子邮件地址"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getUserInfo,
  resetPassword,
  forgotPassword
}; 