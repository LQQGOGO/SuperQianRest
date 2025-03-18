const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async findByUsername(username) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  static async findById(id) {
    try {
      const [rows] = await db.query(
        'SELECT id, username, name, phone, email, role, avatar, status, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  static async getAll(options = {}) {
    try {
      let query = `
        SELECT id, username, name, phone, email, role, avatar, status, created_at, updated_at 
        FROM users WHERE 1=1
      `;
      
      const params = [];
      
      if (options.role) {
        query += ' AND role = ?';
        params.push(options.role);
      }
      
      if (options.search) {
        query += ' AND (username LIKE ? OR name LIKE ? OR phone LIKE ? OR email LIKE ?)';
        const searchTerm = `%${options.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }
      
      query += ' ORDER BY created_at DESC';
      
      // 分页
      const page = parseInt(options.page) || 1;
      const limit = parseInt(options.limit) || 10;
      const offset = (page - 1) * limit;
      
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      // 获取总数
      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM users WHERE 1=1 ${
          options.role ? ' AND role = ?' : ''
        } ${
          options.search ? ' AND (username LIKE ? OR name LIKE ? OR phone LIKE ? OR email LIKE ?)' : ''
        }`,
        options.role && options.search
          ? [options.role, `%${options.search}%`, `%${options.search}%`, `%${options.search}%`, `%${options.search}%`]
          : options.role
          ? [options.role]
          : options.search
          ? [`%${options.search}%`, `%${options.search}%`, `%${options.search}%`, `%${options.search}%`]
          : []
      );
      
      const [rows] = await db.query(query, params);
      
      return {
        total: countResult[0].total,
        page,
        limit,
        items: rows
      };
    } catch (error) {
      throw error;
    }
  }
  
  static async create(userData) {
    try {
      // 密码加密
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const [result] = await db.query(
        `INSERT INTO users (username, password, name, phone, email, role, avatar, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.username,
          hashedPassword,
          userData.name,
          userData.phone || null,
          userData.email || null,
          userData.role || 'customer',
          userData.avatar || '/avatars/default.png',
          userData.status || 1
        ]
      );
      
      const [newUser] = await db.query(
        'SELECT id, username, name, phone, email, role, avatar, status, created_at, updated_at FROM users WHERE id = ?',
        [result.insertId]
      );
      
      return newUser[0];
    } catch (error) {
      throw error;
    }
  }
  
  static async update(id, userData) {
    try {
      let query = 'UPDATE users SET ';
      const params = [];
      const updateFields = [];
      
      if (userData.name !== undefined) {
        updateFields.push('name = ?');
        params.push(userData.name);
      }
      
      if (userData.phone !== undefined) {
        updateFields.push('phone = ?');
        params.push(userData.phone);
      }
      
      if (userData.email !== undefined) {
        updateFields.push('email = ?');
        params.push(userData.email);
      }
      
      if (userData.role !== undefined) {
        updateFields.push('role = ?');
        params.push(userData.role);
      }
      
      if (userData.avatar !== undefined) {
        updateFields.push('avatar = ?');
        params.push(userData.avatar);
      }
      
      if (userData.status !== undefined) {
        updateFields.push('status = ?');
        params.push(userData.status);
      }
      
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        updateFields.push('password = ?');
        params.push(hashedPassword);
      }
      
      if (updateFields.length === 0) {
        throw new Error('没有提供要更新的字段');
      }
      
      query += updateFields.join(', ');
      query += ' WHERE id = ?';
      params.push(id);
      
      await db.query(query, params);
      
      const [updatedUser] = await db.query(
        'SELECT id, username, name, phone, email, role, avatar, status, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      
      return updatedUser[0];
    } catch (error) {
      throw error;
    }
  }
  
  static async delete(id) {
    try {
      await db.query('DELETE FROM users WHERE id = ?', [id]);
      return id;
    } catch (error) {
      throw error;
    }
  }
  
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User; 