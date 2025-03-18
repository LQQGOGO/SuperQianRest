const pool = require('../config/database');
const AppError = require('../utils/errorHandler');

// 获取店铺信息
exports.getShopInfo = async (req, res, next) => {
  try {
    // 获取店铺设置
    const [shopInfo] = await pool.query(
      `SELECT * FROM shop_settings LIMIT 1`
    );
    
    if (shopInfo.length === 0) {
      return next(new AppError('店铺信息不存在', 404));
    }
    
    res.status(200).json(shopInfo[0]);
  } catch (error) {
    next(error);
  }
};

// 更新店铺信息
exports.updateShopInfo = async (req, res, next) => {
  try {
    const { 
      shop_name, 
      logo, 
      address, 
      phone, 
      email, 
      business_hours, 
      description 
    } = req.body;
    
    // 检查店铺信息是否存在
    const [shopExists] = await pool.query(
      `SELECT id FROM shop_settings LIMIT 1`
    );
    
    if (shopExists.length === 0) {
      // 创建新的店铺信息
      await pool.query(
        `INSERT INTO shop_settings (shop_name, logo, address, phone, email, business_hours, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [shop_name, logo, address, phone, email, business_hours, description]
      );
    } else {
      // 更新现有店铺信息
      const updateData = {};
      
      if (shop_name !== undefined) updateData.shop_name = shop_name;
      if (logo !== undefined) updateData.logo = logo;
      if (address !== undefined) updateData.address = address;
      if (phone !== undefined) updateData.phone = phone;
      if (email !== undefined) updateData.email = email;
      if (business_hours !== undefined) updateData.business_hours = business_hours;
      if (description !== undefined) updateData.description = description;
      
      // 构建更新查询
      if (Object.keys(updateData).length > 0) {
        let query = 'UPDATE shop_settings SET ';
        const queryParams = [];
        
        Object.entries(updateData).forEach(([key, value], index) => {
          if (index > 0) query += ', ';
          query += `${key} = ?`;
          queryParams.push(value);
        });
        
        query += ' WHERE id = ?';
        queryParams.push(shopExists[0].id);
        
        await pool.query(query, queryParams);
      }
    }
    
    // 获取更新后的店铺信息
    const [updatedShopInfo] = await pool.query(
      `SELECT * FROM shop_settings LIMIT 1`
    );
    
    res.status(200).json({
      message: '店铺信息更新成功',
      shopInfo: updatedShopInfo[0]
    });
  } catch (error) {
    next(error);
  }
}; 