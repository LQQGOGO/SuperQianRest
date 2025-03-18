const db = require('../config/db');

class Setting {
  static async getShopInfo() {
    try {
      const [rows] = await db.query('SELECT * FROM shop_settings LIMIT 1');
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  
  static async updateShopInfo(shopData) {
    try {
      // 检查是否已有记录
      const [existingRows] = await db.query('SELECT id FROM shop_settings LIMIT 1');
      
      if (existingRows.length > 0) {
        // 更新现有记录
        let query = 'UPDATE shop_settings SET ';
        const params = [];
        const updateFields = [];
        
        if (shopData.shop_name !== undefined) {
          updateFields.push('shop_name = ?');
          params.push(shopData.shop_name);
        }
        
        if (shopData.logo !== undefined) {
          updateFields.push('logo = ?');
          params.push(shopData.logo);
        }
        
        if (shopData.address !== undefined) {
          updateFields.push('address = ?');
          params.push(shopData.address);
        }
        
        if (shopData.phone !== undefined) {
          updateFields.push('phone = ?');
          params.push(shopData.phone);
        }
        
        if (shopData.email !== undefined) {
          updateFields.push('email = ?');
          params.push(shopData.email);
        }
        
        if (shopData.business_hours !== undefined) {
          updateFields.push('business_hours = ?');
          params.push(shopData.business_hours);
        }
        
        if (shopData.description !== undefined) {
          updateFields.push('description = ?');
          params.push(shopData.description);
        }
        
        if (updateFields.length === 0) {
          throw new Error('没有提供要更新的字段');
        }
        
        query += updateFields.join(', ');
        query += ' WHERE id = ?';
        params.push(existingRows[0].id);
        
        await db.query(query, params);
      } else {
        // 创建新记录
        await db.query(
          `INSERT INTO shop_settings (shop_name, logo, address, phone, email, business_hours, description)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            shopData.shop_name || '默认店铺名称',
            shopData.logo || null,
            shopData.address || null,
            shopData.phone || null,
            shopData.email || null,
            shopData.business_hours || null,
            shopData.description || null
          ]
        );
      }
      
      // 返回更新后的数据
      const [updatedRows] = await db.query('SELECT * FROM shop_settings LIMIT 1');
      return updatedRows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Setting; 