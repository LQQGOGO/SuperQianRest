const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../models/db');
const { authenticateToken } = require('../middlewares/auth');
const { ApiError } = require('../middlewares/errorHandler');

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    获取用户列表
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      throw new ApiError(403, '没有权限执行此操作');
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // 获取用户列表
    const [users] = await pool.query(
      `SELECT id, username, name, phone, email, role, avatar, status, created_at
       FROM users
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    // 获取总数
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM users');
    const total = countResult[0].total;
    
    res.json({
      users,
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
 * @route   GET /api/users/:id
 * @desc    获取用户详情
 * @access  Private
 */
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      throw new ApiError(403, '没有权限执行此操作');
    }
    
    const userId = req.params.id;
    
    const [users] = await pool.query(
      `SELECT id, username, name, phone, email, role, avatar, status, address, created_at
       FROM users
       WHERE id = ?`,
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
 * @route   POST /api/users
 * @desc    添加用户
 * @access  Private
 */
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      throw new ApiError(403, '没有权限执行此操作');
    }
    
    const { username, password, name, phone, email, role, status } = req.body;
    
    // 检查用户名是否已存在
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    
    if (existingUsers.length > 0) {
      throw new ApiError(400, '用户名已存在');
    }
    
    // 哈希密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 创建用户
    const [result] = await pool.query(
      `INSERT INTO users (username, password, name, phone, email, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, name, phone, email, role, status]
    );
    
    const [newUser] = await pool.query(
      `SELECT id, username, name, phone, email, role, status, created_at
       FROM users
       WHERE id = ?`,
      [result.insertId]
    );
    
    res.status(201).json(newUser[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    更新用户
 * @access  Private
 */
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      throw new ApiError(403, '没有权限执行此操作');
    }
    
    const userId = req.params.id;
    const { name, phone, email, role, status } = req.body;
    
    // 检查用户是否存在
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );
    
    if (existingUsers.length === 0) {
      throw new ApiError(404, '用户不存在');
    }
    
    // 更新用户
    await pool.query(
      `UPDATE users
       SET name = ?, phone = ?, email = ?, role = ?, status = ?
       WHERE id = ?`,
      [name, phone, email, role, status, userId]
    );
    
    const [updatedUser] = await pool.query(
      `SELECT id, username, name, phone, email, role, status, updated_at
       FROM users
       WHERE id = ?`,
      [userId]
    );
    
    res.json(updatedUser[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    删除用户
 * @access  Private
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      throw new ApiError(403, '没有权限执行此操作');
    }
    
    const userId = req.params.id;
    
    // 检查用户是否存在
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );
    
    if (existingUsers.length === 0) {
      throw new ApiError(404, '用户不存在');
    }
    
    // 删除用户
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    
    res.json({ message: '用户已成功删除' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 