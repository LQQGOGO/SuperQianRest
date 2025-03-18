const db = require('../config/db');

class MenuItem {
  static async getAll(options = {}) {
    console.log('接收到菜单列表请求:', options);
    try {
      let query = `
        SELECT m.*, c.name as category_name 
        FROM menu_items m
        LEFT JOIN menu_categories c ON m.category_id = c.id
        WHERE 1=1
      `;

      const params = [];

      if (options.category_id) {
        query += ' AND m.category_id = ?';
        params.push(options.category_id);
      }

      if (options.search) {
        query += ' AND (m.name LIKE ? OR m.description LIKE ?)';
        const searchTerm = `%${options.search}%`;
        params.push(searchTerm, searchTerm);
      }

      query += ' ORDER BY m.id DESC';

      // 分页
      const page = parseInt(options.page) || 1;
      const limit = parseInt(options.limit) || 20;
      const offset = (page - 1) * limit;

      // 获取总数
      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM menu_items m WHERE 1=1 ${
          options.category_id ? ' AND m.category_id = ?' : ''
        } ${options.search ? ' AND (m.name LIKE ? OR m.description LIKE ?)' : ''}`,
        options.category_id && options.search
          ? [options.category_id, `%${options.search}%`, `%${options.search}%`]
          : options.category_id
          ? [options.category_id]
          : options.search
          ? [`%${options.search}%`, `%${options.search}%`]
          : []
      );

      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await db.query(query, params);

      return {
        total: countResult[0].total,
        page,
        limit,
        items: rows,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.query(
        `SELECT m.*, c.name as category_name 
         FROM menu_items m
         LEFT JOIN menu_categories c ON m.category_id = c.id
         WHERE m.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(menuItemData) {
    try {
      const [result] = await db.query(
        `INSERT INTO menu_items (category_id, name, description, price, image, is_special, is_available) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          menuItemData.category_id,
          menuItemData.name,
          menuItemData.description || null,
          menuItemData.price,
          menuItemData.image || null,
          menuItemData.is_special || 0,
          menuItemData.is_available || 1,
        ]
      );

      const [newMenuItem] = await db.query('SELECT * FROM menu_items WHERE id = ?', [
        result.insertId,
      ]);
      return newMenuItem[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, menuItemData) {
    try {
      let query = 'UPDATE menu_items SET ';
      const params = [];
      const updateFields = [];

      if (menuItemData.category_id !== undefined) {
        updateFields.push('category_id = ?');
        params.push(menuItemData.category_id);
      }

      if (menuItemData.name !== undefined) {
        updateFields.push('name = ?');
        params.push(menuItemData.name);
      }

      if (menuItemData.description !== undefined) {
        updateFields.push('description = ?');
        params.push(menuItemData.description);
      }

      if (menuItemData.price !== undefined) {
        updateFields.push('price = ?');
        params.push(menuItemData.price);
      }

      if (menuItemData.image !== undefined) {
        updateFields.push('image = ?');
        params.push(menuItemData.image);
      }

      if (menuItemData.is_special !== undefined) {
        updateFields.push('is_special = ?');
        params.push(menuItemData.is_special);
      }

      if (menuItemData.is_available !== undefined) {
        updateFields.push('is_available = ?');
        params.push(menuItemData.is_available);
      }

      if (updateFields.length === 0) {
        throw new Error('没有提供要更新的字段');
      }

      query += updateFields.join(', ');
      query += ' WHERE id = ?';
      params.push(id);

      await db.query(query, params);

      const [updatedMenuItem] = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);
      return updatedMenuItem[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db.query('DELETE FROM menu_items WHERE id = ?', [id]);
      return id;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MenuItem;
