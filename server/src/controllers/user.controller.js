const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const AppError = require('../utils/errorHandler');

// 获取用户列表
exports.getUserList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT id, username, name, phone, email, role, avatar, status, created_at, updated_at
      FROM users
      WHERE 1=1
    `;
    
    const queryParams = [];
    
    // 添加筛选条件
    if (role) {
      query += ` AND role = ?`;
      queryParams.push(role);
    }
    
    if (search) {
      query += ` AND (username LIKE ? OR name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // 添加排序和分页
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // 执行查询
    const [users] = await pool.query(query, queryParams);
    
    // 获取总数
    let countQuery = `
      SELECT COUNT(*) as total
      FROM users
      WHERE 1=1
    `;
    
    // 添加相同的筛选条件
    if (role) {
      countQuery += ` AND role = ?`;
    }
    
    if (search) {
      countQuery += ` AND (username LIKE ? OR name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
    }
    
    const [totalResult] = await pool.query(countQuery, queryParams.slice(0, -2));
    
    res.status(200).json({
      total: totalResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      items: users
    });
  } catch (error) {
    next(error);
  }
};

// 创建用户
exports.createUser = async (req, res, next) => {
  try {
    const { username, password, name, phone, email, role, avatar } = req.body;
    
    if (!username || !password || !name) {
      return next(new AppError('请提供必要的用户信息', 400));
    }
    
    // 检查用户名是否已存在
    const [existingUsers] = await pool.query(
      `SELECT id FROM users WHERE username = ?`,
      [username]
    );
    
    if (existingUsers.length > 0) {
      return next(new AppError('用户名已存在', 400));
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户
    const [result] = await pool.query(
      `INSERT INTO users (username, password, name, phone, email, role, avatar, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [username, hashedPassword, name, phone, email, role || 'customer', avatar]
    );
    
    // 获取创建的用户
    const [newUser] = await pool.query(
      `SELECT id, username, name, phone, email, role, avatar, status, created_at, updated_at
       FROM users WHERE id = ?`,
      [result.insertId]
    );
    
    res.status(201).json({
      message: '用户创建成功',
      user: newUser[0]
    });
  } catch (error) {
    next(error);
  }
};

// 更新用户信息
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, email, role, avatar, status, password } = req.body;
    
    // 检查用户是否存在
    const [existingUser] = await pool.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
    
    if (existingUser.length === 0) {
      return next(new AppError('用户不存在', 404));
    }
    
    // 准备更新数据
    const updateData = {
      name: name || existingUser[0].name,
      phone: phone !== undefined ? phone : existingUser[0].phone,
      email: email !== undefined ? email : existingUser[0].email,
      role: role || existingUser[0].role,
      avatar: avatar !== undefined ? avatar : existingUser[0].avatar,
      status: status !== undefined ? status : existingUser[0].status
    };
    
    // 如果提供了新密码，则更新密码
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    // 构建更新查询
    let query = 'UPDATE users SET ';
    const queryParams = [];
    
    Object.entries(updateData).forEach(([key, value], index) => {
      if (index > 0) query += ', ';
      query += `${key} = ?`;
      queryParams.push(value);
    });
    
    query += ' WHERE id = ?';
    queryParams.push(id);
    
    // 执行更新
    await pool.query(query, queryParams);
    
    // 获取更新后的用户
    const [updatedUser] = await pool.query(
      `SELECT id, username, name, phone, email, role, avatar, status, created_at, updated_at
       FROM users WHERE id = ?`,
      [id]
    );
    
    res.status(200).json({
      message: '用户信息更新成功',
      user: updatedUser[0]
    });
  } catch (error) {
    next(error);
  }
};

// 删除用户
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 检查用户是否存在
    const [existingUser] = await pool.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
    
    if (existingUser.length === 0) {
      return next(new AppError('用户不存在', 404));
    }
    
    // 删除用户
    await pool.query(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );
    
    res.status(200).json({
      message: '用户删除成功',
      id
    });
  } catch (error) {
    next(error);
  }
}; 