const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../models/db');
const { authenticateToken } = require('../middlewares/auth');
const { ApiError } = require('../middlewares/errorHandler');
const validate = require('../middlewares/validator');
const { userSchemas } = require('../utils/validationSchemas');

const router = express.Router();

/**
 * @route   GET /api/personal/profile
 * @desc    获取当前用户资料
 * @access  Private
 */
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const [users] = await pool.query(
      'SELECT id, username, name, phone, email, avatar FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      throw new ApiError(404, '用户不存在');
    }
    
    res.json(users[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/personal/profile
 * @desc    更新当前用户资料
 * @access  Private
 */
router.put('/profile', authenticateToken, validate(userSchemas.updateProfile), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone, email, avatar } = req.body;
    
    await pool.query(
      'UPDATE users SET name = ?, phone = ?, email = ?, avatar = ? WHERE id = ?',
      [name, phone, email, avatar, userId]
    );
    
    const [updatedUser] = await pool.query(
      'SELECT id, username, name, phone, email, avatar FROM users WHERE id = ?',
      [userId]
    );
    
    res.json(updatedUser[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/personal/password
 * @desc    修改当前用户密码
 * @access  Private
 */
router.put('/password', authenticateToken, validate(userSchemas.changePassword), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    
    // 获取用户当前密码
    const [users] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      throw new ApiError(404, '用户不存在');
    }
    
    // 验证旧密码
    const isMatch = await bcrypt.compare(oldPassword, users[0].password);
    if (!isMatch) {
      throw new ApiError(400, '旧密码不正确');
    }
    
    // 哈希新密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // 更新密码
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    
    res.json({ message: '密码修改成功' });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/personal/notifications
 * @desc    获取当前用户的通知
 * @access  Private
 */
router.get('/notifications', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // 获取通知
    const [notifications] = await pool.query(
      `SELECT id, title, content, is_read, type, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    
    // 获取总数
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM notifications WHERE user_id = ?',
      [userId]
    );
    
    const total = countResult[0].total;
    
    res.json({
      notifications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/personal/notifications/:id/read
 * @desc    标记通知为已读
 * @access  Private
 */
router.put('/notifications/:id/read', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    // 确保通知属于当前用户
    const [notification] = await pool.query(
      'SELECT id FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );
    
    if (notification.length === 0) {
      throw new ApiError(404, '通知不存在');
    }
    
    // 标记为已读
    await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ?',
      [notificationId]
    );
    
    res.json({ message: '通知已标记为已读' });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/personal/notifications/read-all
 * @desc    标记所有通知为已读
 * @access  Private
 */
router.put('/notifications/read-all', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 标记所有通知为已读
    await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    
    res.json({ message: '所有通知已标记为已读' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 