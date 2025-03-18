const express = require('express');
const { pool } = require('../models/db');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route   GET /api/orders
 * @desc    获取订单列表
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    
    let query = `
      SELECT o.*, u.name AS customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
    
    const queryParams = [];
    
    if (status) {
      query += ' WHERE o.status = ?';
      queryParams.push(status);
    }
    
    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    
    const [orders] = await pool.query(query, queryParams);
    
    // 获取总订单数
    let countQuery = 'SELECT COUNT(*) AS total FROM orders';
    if (status) {
      countQuery += ' WHERE status = ?';
    }
    
    const [countResult] = await pool.query(countQuery, status ? [status] : []);
    const total = countResult[0].total;
    
    res.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('获取订单列表错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    获取订单详情
 * @access  Private
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // 获取订单基本信息
    const [orders] = await pool.query(
      `SELECT o.*, u.name AS customer_name, u.phone AS customer_phone
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [req.params.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    // 获取订单项
    const [orderItems] = await pool.query(
      `SELECT oi.*, mi.name AS menu_item_name, mi.image
       FROM order_items oi
       LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    
    res.json({
      ...orders[0],
      items: orderItems
    });
  } catch (err) {
    console.error('获取订单详情错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   POST /api/orders
 * @desc    创建订单
 * @access  Private
 */
router.post('/', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { user_id, items, total_amount, address, phone, notes, payment_method } = req.body;
    
    // 验证请求体
    if (!user_id || !items || !items.length || !total_amount) {
      return res.status(400).json({ message: '缺少必要的订单信息' });
    }
    
    // 生成订单号
    const orderNumber = 'ORD' + Date.now().toString().slice(-10);
    
    // 创建订单
    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_number, user_id, total_amount, status, payment_status, payment_method, address, phone, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, user_id, total_amount, 'pending', 'unpaid', payment_method, address, phone, notes]
    );
    
    const orderId = orderResult.insertId;
    
    // 添加订单项
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, subtotal, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.menu_item_id, item.menu_item_name, item.quantity, item.unit_price, item.subtotal, item.notes || '']
      );
    }
    
    await connection.commit();
    
    // 获取创建的订单
    const [newOrder] = await connection.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );
    
    res.status(201).json(newOrder[0]);
  } catch (err) {
    await connection.rollback();
    console.error('创建订单错误:', err);
    res.status(500).json({ message: '服务器错误: ' + err.message });
  } finally {
    connection.release();
  }
});

/**
 * @route   PUT /api/orders/:id
 * @desc    更新订单状态
 * @access  Private
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, payment_status } = req.body;
    
    // 检查订单是否存在
    const [existingOrders] = await pool.query(
      'SELECT id FROM orders WHERE id = ?',
      [req.params.id]
    );
    
    if (existingOrders.length === 0) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    // 更新订单状态
    await pool.query(
      `UPDATE orders
       SET status = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, payment_status, req.params.id]
    );
    
    // 获取更新后的订单
    const [updatedOrder] = await pool.query(
      'SELECT * FROM orders WHERE id = ?',
      [req.params.id]
    );
    
    res.json(updatedOrder[0]);
  } catch (err) {
    console.error('更新订单状态错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   GET /api/orders/statistics
 * @desc    获取订单统计数据
 * @access  Private
 */
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = req.query.endDate || new Date().toISOString().split('T')[0];
    
    // 获取不同时间段的订单统计
    const [orderStats] = await pool.query(
      `SELECT 
          DATE(created_at) AS date,
          COUNT(*) AS order_count,
          SUM(total_amount) AS total_sales,
          AVG(total_amount) AS average_order_value
       FROM orders
       WHERE created_at BETWEEN ? AND ? AND payment_status = 'paid'
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [startDate, endDate + ' 23:59:59']
    );
    
    // 获取不同状态的订单数量
    const [statusStats] = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM orders
       WHERE created_at BETWEEN ? AND ?
       GROUP BY status`,
      [startDate, endDate + ' 23:59:59']
    );
    
    // 获取热门菜品
    const [popularItems] = await pool.query(
      `SELECT 
          mi.id,
          mi.name,
          SUM(oi.quantity) AS total_quantity,
          SUM(oi.subtotal) AS total_sales
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.created_at BETWEEN ? AND ? AND o.payment_status = 'paid'
       GROUP BY mi.id, mi.name
       ORDER BY total_quantity DESC
       LIMIT 10`,
      [startDate, endDate + ' 23:59:59']
    );
    
    res.json({
      orderStats,
      statusStats,
      popularItems
    });
  } catch (err) {
    console.error('获取订单统计错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 