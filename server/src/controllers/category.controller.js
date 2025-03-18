const pool = require('../config/database');
const AppError = require('../utils/errorHandler');

// 获取所有分类
exports.getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      `SELECT * FROM menu_categories ORDER BY sort_order`
    );
    
    res.status(200).json({
      total: categories.length,
      items: categories
    });
  } catch (error) {
    next(error);
  }
};

// 添加新分类
exports.addCategory = async (req, res, next) => {
  try {
    const { name, description, image, sort_order = 0, status = 1 } = req.body;
    
    if (!name) {
      return next(new AppError('请提供分类名称', 400));
    }
    
    const [result] = await pool.query(
      `INSERT INTO menu_categories (name, description, image, sort_order, status)
       VALUES (?, ?, ?, ?, ?)`,
      [name, description, image, sort_order, status]
    );
    
    const [newCategory] = await pool.query(
      `SELECT * FROM menu_categories WHERE id = ?`,
      [result.insertId]
    );
    
    res.status(201).json({
      message: '分类添加成功',
      category: newCategory[0]
    });
  } catch (error) {
    next(error);
  }
};

// 更新分类
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, sort_order, status } = req.body;
    
    // 检查分类是否存在
    const [existingCategory] = await pool.query(
      `SELECT * FROM menu_categories WHERE id = ?`,
      [id]
    );
    
    if (existingCategory.length === 0) {
      return next(new AppError('分类不存在', 404));
    }
    
    // 准备更新数据
    const updateData = {
      name: name || existingCategory[0].name,
      description: description !== undefined ? description : existingCategory[0].description,
      image: image !== undefined ? image : existingCategory[0].image,
      sort_order: sort_order !== undefined ? sort_order : existingCategory[0].sort_order,
      status: status !== undefined ? status : existingCategory[0].status
    };
    
    // 构建更新查询
    let query = 'UPDATE menu_categories SET ';
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
    
    // 获取更新后的分类
    const [updatedCategory] = await pool.query(
      `SELECT * FROM menu_categories WHERE id = ?`,
      [id]
    );
    
    res.status(200).json({
      message: '分类更新成功',
      category: updatedCategory[0]
    });
  } catch (error) {
    next(error);
  }
};

// 删除分类
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 检查分类是否存在
    const [existingCategory] = await pool.query(
      `SELECT * FROM menu_categories WHERE id = ?`,
      [id]
    );
    
    if (existingCategory.length === 0) {
      return next(new AppError('分类不存在', 404));
    }
    
    // 检查分类是否被菜单项引用
    const [menuItems] = await pool.query(
      `SELECT COUNT(*) as count FROM menu_items WHERE category_id = ?`,
      [id]
    );
    
    if (menuItems[0].count > 0) {
      return next(new AppError('该分类下有菜单项，无法删除', 400));
    }
    
    // 删除分类
    await pool.query(
      `DELETE FROM menu_categories WHERE id = ?`,
      [id]
    );
    
    res.status(200).json({
      message: '分类删除成功',
      id
    });
  } catch (error) {
    next(error);
  }
}; 