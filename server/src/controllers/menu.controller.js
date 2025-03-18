const pool = require('../config/database');
const AppError = require('../utils/errorHandler');

// 获取所有菜单
exports.getAllMenus = async (req, res, next) => {
  try {
    const { category_id, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT m.*, c.name as category_name
      FROM menu_items m
      LEFT JOIN menu_categories c ON m.category_id = c.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    
    // 添加筛选条件
    if (category_id) {
      query += ` AND m.category_id = ?`;
      queryParams.push(category_id);
    }
    
    if (search) {
      query += ` AND (m.name LIKE ? OR m.description LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    // 添加排序和分页
    query += ` ORDER BY m.category_id, m.id LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // 执行查询
    const [menuItems] = await pool.query(query, queryParams);
    
    // 获取总数
    let countQuery = `
      SELECT COUNT(*) as total
      FROM menu_items m
      WHERE 1=1
    `;
    
    // 添加相同的筛选条件
    if (category_id) {
      countQuery += ` AND m.category_id = ?`;
    }
    
    if (search) {
      countQuery += ` AND (m.name LIKE ? OR m.description LIKE ?)`;
    }
    
    const countParams = queryParams.slice(0, -2);
    const [totalResult] = await pool.query(countQuery, countParams);
    
    // 获取所有分类
    const [categories] = await pool.query(
      `SELECT * FROM menu_categories ORDER BY sort_order`
    );
    
    res.status(200).json({
      total: totalResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      categories,
      items: menuItems
    });
  } catch (error) {
    next(error);
  }
};

// 添加新菜单
exports.addMenu = async (req, res, next) => {
  try {
    const { 
      name, 
      price, 
      description, 
      category_id, 
      image, 
      is_special = 0, 
      is_available = 1 
    } = req.body;

    if (!name || !price || !category_id) {
      return next(new AppError('请提供必要的菜单信息', 400));
    }

    // 检查分类是否存在
    const [categoryExists] = await pool.query(
      `SELECT id FROM menu_categories WHERE id = ?`,
      [category_id]
    );

    if (categoryExists.length === 0) {
      return next(new AppError('菜单分类不存在', 400));
    }

    const [result] = await pool.query(
      `INSERT INTO menu_items (name, price, description, category_id, image, is_special, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, price, description, category_id, image, is_special, is_available]
    );

    const [newMenuItem] = await pool.query(
      `SELECT m.*, c.name as category_name
       FROM menu_items m
       LEFT JOIN menu_categories c ON m.category_id = c.id
       WHERE m.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: '菜单项添加成功',
      menuItem: newMenuItem[0]
    });
  } catch (error) {
    next(error);
  }
};

// 更新菜单
exports.updateMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      price, 
      description, 
      category_id, 
      image, 
      is_special, 
      is_available 
    } = req.body;

    // 检查菜单项是否存在
    const [existingMenuItem] = await pool.query(
      `SELECT * FROM menu_items WHERE id = ?`,
      [id]
    );

    if (existingMenuItem.length === 0) {
      return next(new AppError('菜单项不存在', 404));
    }

    // 如果提供了分类ID，检查分类是否存在
    if (category_id) {
      const [categoryExists] = await pool.query(
        `SELECT id FROM menu_categories WHERE id = ?`,
        [category_id]
      );

      if (categoryExists.length === 0) {
        return next(new AppError('菜单分类不存在', 400));
      }
    }

    // 准备更新数据
    const updateData = {
      name: name || existingMenuItem[0].name,
      price: price || existingMenuItem[0].price,
      description: description !== undefined ? description : existingMenuItem[0].description,
      category_id: category_id || existingMenuItem[0].category_id,
      image: image !== undefined ? image : existingMenuItem[0].image,
      is_special: is_special !== undefined ? is_special : existingMenuItem[0].is_special,
      is_available: is_available !== undefined ? is_available : existingMenuItem[0].is_available
    };

    // 构建更新查询
    let query = 'UPDATE menu_items SET ';
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

    // 获取更新后的菜单项
    const [updatedMenuItem] = await pool.query(
      `SELECT m.*, c.name as category_name
       FROM menu_items m
       LEFT JOIN menu_categories c ON m.category_id = c.id
       WHERE m.id = ?`,
      [id]
    );

    res.status(200).json({
      message: '菜单项更新成功',
      menuItem: updatedMenuItem[0]
    });
  } catch (error) {
    next(error);
  }
};

// 删除菜单
exports.deleteMenu = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 检查菜单项是否存在
    const [existingMenuItem] = await pool.query(
      `SELECT * FROM menu_items WHERE id = ?`,
      [id]
    );

    if (existingMenuItem.length === 0) {
      return next(new AppError('菜单项不存在', 404));
    }

    // 检查菜单项是否被订单引用
    const [orderItems] = await pool.query(
      `SELECT COUNT(*) as count FROM order_items WHERE menu_item_id = ?`,
      [id]
    );

    if (orderItems[0].count > 0) {
      return next(new AppError('该菜单项已被订单引用，无法删除', 400));
    }

    // 删除菜单项
    await pool.query(
      `DELETE FROM menu_items WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      message: '菜单项删除成功',
      id
    });
  } catch (error) {
    next(error);
  }
}; 