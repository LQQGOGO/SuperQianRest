const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, authenticateToken, JWT_SECRET } = require('../app');

const router = express.Router();

/**
 * @route   POST /auth/login
 * @desc    管理员登录
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证请求体
    if (!username || !password) {
      return res.status(400).json({ message: '请提供用户名和密码' });
    }
    
    // 查询用户
    const [users] = await pool.query(
      'SELECT id, username, password, role FROM users WHERE username = ? AND (role = "admin" OR role = "staff")',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    const user = users[0];
    
    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // 返回令牌和用户信息
    res.json({
      token,
      adminInfo: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   GET /auth/info
 * @desc    获取当前管理员信息
 * @access  Private
 */
router.get('/info', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 查询用户信息
    const [users] = await pool.query(
      'SELECT id, username, role FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
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
  } catch (err) {
    console.error('获取用户信息错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   POST /auth/reset-admin
 * @desc    重置管理员密码（需要特殊重置码）
 * @access  Public
 */
router.post('/reset-admin', async (req, res) => {
  try {
    const { username, newPassword, resetCode } = req.body;
    
    // 验证请求体
    if (!username || !newPassword || !resetCode) {
      return res.status(400).json({ message: '请提供所有必要的字段' });
    }
    
    // 验证重置码
    const validResetCode = 'RESET_677_GOGO_2024';
    if (resetCode !== validResetCode) {
      return res.status(401).json({ message: '重置码无效' });
    }
    
    // 查询用户
    const [users] = await pool.query(
      'SELECT id FROM users WHERE username = ? AND role = "admin"',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: '管理员用户不存在' });
    }
    
    // 加密新密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // 更新密码
    await pool.query(
      'UPDATE users SET password = ? WHERE username = ? AND role = "admin"',
      [hashedPassword, username]
    );
    
    res.json({
      message: '管理员密码重置成功',
      username
    });
  } catch (err) {
    console.error('重置密码错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 