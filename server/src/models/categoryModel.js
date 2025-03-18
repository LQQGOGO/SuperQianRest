const db = require('../config/db');

class Category {
  static async getAll() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM menu_categories ORDER BY sort_order ASC'
      );
      
      const [countResult] = await db.query('SELECT COUNT(*) as total FROM menu_categories');
      
      return {
        total: countResult[0].total,
        items: rows
      };
    } catch (error) {
      throw error;
    }
  }
  
  static async getById(id) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM menu_categories WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  static async create(categoryData) {
    try {
      const [result] = await db.query(
        `INSERT INTO menu_categories (name, description, image, sort_order, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          categoryData.name,
          categoryData.description || null,
          categoryData.image || null,
          categoryData.sort_order || 0,
          categoryData.status || 1
        ]
      );
      
      const [newCategory] = await db.query(
        'SELECT * FROM menu_categories WHERE id = ?',
        [result.insertId]
      );
      
      return newCategory[0];
    } catch (error) {
      throw error;
    }
  }
  
  static async update(id, categoryData) {
    try {
      let query = 'UPDATE menu_categories SET ';
      const params = [];
      const updateFields = [];
      
      if (categoryData.name !== undefined) {
        updateFields.push('name = ?');
        params.push(categoryData.name);
      }
      
      if (categoryData.description !== undefined) {
        updateFields.push('description = ?');
        params.push(categoryData.description);
      }
      
      if (categoryData.image !== undefined) {
        updateFields.push('image = ?');
        params.push(categoryData.image);
      }
      
      if (categoryData.sort_order !== undefined) {
        updateFields.push('sort_order = ?');
        params.push(categoryData.sort_order);
      }
      
      if (categoryData.status !== undefined) {
        updateFields.push('status = ?');
        params.push(categoryData.status);
      }
      
      if (updateFields.length === 0) {
        throw new Error('没有提供要更新的字段');
      }
      
      query += updateFields.join(', ');
      query += ' WHERE id = ?';
      params.push(id);
      
      await db.query(query, params);
      
      const [updatedCategory] = await db.query(
        'SELECT * FROM menu_categories WHERE id = ?',
        [id]
      );
      
      return updatedCategory[0];
    } catch (error) {
      throw error;
    }
  }
  
  static async delete(id) {
    try {
      // 检查是否有菜单项使用此分类
      const [menuItems] = await db.query(
        'SELECT COUNT(*) as count FROM menu_items WHERE category_id = ?',
        [id]
      );
      
      if (menuItems[0].count > 0) {
        throw new Error('无法删除分类，因为有菜单项正在使用它');
      }
      
      await db.query('DELETE FROM menu_categories WHERE id = ?', [id]);
      return id;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Category; 