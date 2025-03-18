const pool = require('../config/database');
const AppError = require('../utils/errorHandler');

// 获取订单列表
exports.getOrderList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT o.*, u.username, u.name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    
    // 添加筛选条件
    if (status) {
      query += ` AND o.status = ?`;
      queryParams.push(status);
    }
    
    if (startDate) {
      query += ` AND DATE(o.created_at) >= ?`;
      queryParams.push(startDate);
    }
    
    if (endDate) {
      query += ` AND DATE(o.created_at) <= ?`;
      queryParams.push(endDate);
    }
    
    if (search) {
      query += ` AND (o.order_number LIKE ? OR u.username LIKE ? OR u.name LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // 添加排序和分页
    query += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // 执行查询
    const [orders] = await pool.query(query, queryParams);
    
    // 获取总数
    let countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    
    // 添加相同的筛选条件
    if (status) {
      countQuery += ` AND o.status = ?`;
    }
    
    if (startDate) {
      countQuery += ` AND DATE(o.created_at) >= ?`;
    }
    
    if (endDate) {
      countQuery += ` AND DATE(o.created_at) <= ?`;
    }
    
    if (search) {
      countQuery += ` AND (o.order_number LIKE ? OR u.username LIKE ? OR u.name LIKE ?)`;
    }
    
    const [totalResult] = await pool.query(countQuery, queryParams.slice(0, -2));
    
    // 获取订单详情
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    
    res.status(200).json({
      total: totalResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      items: orders
    });
  } catch (error) {
    next(error);
  }
};

// 获取订单统计数据
exports.getOrderStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    // 默认为过去30天
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    
    const start = startDate || defaultStartDate.toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];
    
    // 获取订单状态统计
    const [statusStats] = await pool.query(
      `SELECT 
        status,
        COUNT(*) as count,
        SUM(total_amount) as total
       FROM orders
       WHERE created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
       GROUP BY status`,
      [start, end]
    );
    
    // 获取每日订单统计
    const [dailyStats] = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        SUM(total_amount) as total
       FROM orders
       WHERE created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [start, end]
    );
    
    // 获取支付方式统计
    const [paymentStats] = await pool.query(
      `SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(total_amount) as total
       FROM orders
       WHERE created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
       AND payment_method IS NOT NULL
       GROUP BY payment_method`,
      [start, end]
    );
    
    // 获取总计
    const [totals] = await pool.query(
      `SELECT 
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales,
        AVG(total_amount) as average_order_value
       FROM orders
       WHERE created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)`,
      [start, end]
    );
    
    res.status(200).json({
      statusStats,
      dailyStats,
      paymentStats,
      totals: totals[0],
      timeRange: {
        start,
        end
      }
    });
  } catch (error) {
    next(error);
  }
};

// 创建订单
exports.createOrder = async (req, res, next) => {
  // 获取数据库连接
  const connection = await pool.getConnection();
  
  try {
    // 开始事务
    await connection.beginTransaction();
    
    const { user_id, items, total_amount, address, phone, notes, payment_method } = req.body;
    
    if (!user_id || !items || !total_amount) {
      return next(new AppError('请提供必要的订单信息', 400));
    }
    
    // 生成订单号
    const orderNumber = 'ORD' + new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // 创建订单
    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_number, user_id, total_amount, status, payment_status, payment_method, address, phone, notes)
       VALUES (?, ?, ?, 'pending', 'unpaid', ?, ?, ?, ?)`,
      [orderNumber, user_id, total_amount, payment_method, address, phone, notes]
    );
    
    const orderId = orderResult.insertId;
    
    // 添加订单项
    for (const item of items) {
      // 获取菜单项信息
      const [menuItems] = await connection.query(
        `SELECT name FROM menu_items WHERE id = ?`,
        [item.menu_id]
      );
      
      if (menuItems.length === 0) {
        throw new AppError(`菜单项不存在: ${item.menu_id}`, 400);
      }
      
      const menuItemName = menuItems[0].name;
      
      // 插入订单项
      await connection.query(
        `INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.menu_id, menuItemName, item.quantity, item.price, item.quantity * item.price, item.notes || '']
      );
    }
    
    // 创建订单通知
    await connection.query(
      `INSERT INTO notifications (user_id, title, content, type)
       VALUES (?, ?, ?, 'order')`,
      [user_id, '订单已接收', `您的订单 ${orderNumber} 已成功接收，我们将尽快处理`, 'order']
    );
    
    // 提交事务
    await connection.commit();
    
    // 获取创建的订单
    const [newOrder] = await pool.query(
      `SELECT * FROM orders WHERE id = ?`,
      [orderId]
    );
    
    // 获取订单项
    const [orderItems] = await pool.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );
    
    newOrder[0].items = orderItems;
    
    res.status(201).json({
      message: '订单创建成功',
      order: newOrder[0]
    });
  } catch (error) {
    // 回滚事务
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// 更新订单状态
exports.updateOrder = async (req, res, next) => {
  // 获取数据库连接
  const connection = await pool.getConnection();
  
  try {
    // 开始事务
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { status, payment_status, payment_method } = req.body;
    
    // 检查订单是否存在
    const [existingOrder] = await connection.query(
      `SELECT * FROM orders WHERE id = ?`,
      [id]
    );
    
    if (existingOrder.length === 0) {
      return next(new AppError('订单不存在', 404));
    }
    
    // 更新订单
    let updateQuery = 'UPDATE orders SET updated_at = NOW()';
    const updateParams = [];
    
    if (status) {
      updateQuery += ', status = ?';
      updateParams.push(status);
    }
    
    if (payment_status) {
      updateQuery += ', payment_status = ?';
      updateParams.push(payment_status);
    }
    
    if (payment_method) {
      updateQuery += ', payment_method = ?';
      updateParams.push(payment_method);
    }
    
    updateQuery += ' WHERE id = ?';
    updateParams.push(id);
    
    await connection.query(updateQuery, updateParams);
    
    // 如果订单状态变为已完成，创建通知
    if (status === 'completed' && existingOrder[0].status !== 'completed') {
      await connection.query(
        `INSERT INTO notifications (user_id, title, content, type)
         VALUES (?, ?, ?, 'order')`,
        [
          existingOrder[0].user_id,
          '订单已完成',
          `您的订单 ${existingOrder[0].order_number} 已完成，感谢您的惠顾！`,
          'order'
        ]
      );
    }
    
    // 提交事务
    await connection.commit();
    
    // 获取更新后的订单
    const [updatedOrder] = await pool.query(
      `SELECT * FROM orders WHERE id = ?`,
      [id]
    );
    
    // 获取订单项
    const [orderItems] = await pool.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [id]
    );
    
    updatedOrder[0].items = orderItems;
    
    res.status(200).json({
      message: '订单更新成功',
      order: updatedOrder[0]
    });
  } catch (error) {
    // 回滚事务
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// 删除订单
exports.deleteOrder = async (req, res, next) => {
  // 获取数据库连接
  const connection = await pool.getConnection();
  
  try {
    // 开始事务
    await connection.beginTransaction();
    
    const { id } = req.params;
    
    // 检查订单是否存在
    const [existingOrder] = await connection.query(
      `SELECT * FROM orders WHERE id = ?`,
      [id]
    );
    
    if (existingOrder.length === 0) {
      return next(new AppError('订单不存在', 404));
    }
    
    // 删除订单项
    await connection.query(
      `DELETE FROM order_items WHERE order_id = ?`,
      [id]
    );
    
    // 删除订单
    await connection.query(
      `DELETE FROM orders WHERE id = ?`,
      [id]
    );
    
    // 提交事务
    await connection.commit();
    
    res.status(200).json({
      message: '订单删除成功',
      id
    });
  } catch (error) {
    // 回滚事务
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}; 