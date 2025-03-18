const express = require('express');
const { pool } = require('../models/db');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route   GET /api/reports/sales
 * @desc    获取销售数据报表
 * @access  Private
 */
router.get('/sales', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限执行此操作' });
    }
    
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = req.query.endDate || new Date().toISOString().split('T')[0];
    
    // 获取按日期的销售数据
    const [dailySales] = await pool.query(
      `SELECT 
          DATE(created_at) AS date,
          COUNT(*) AS order_count,
          SUM(total_amount) AS total_sales,
          AVG(total_amount) AS average_order_value
       FROM orders
       WHERE payment_status = 'paid' AND created_at BETWEEN ? AND ?
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [startDate, endDate + ' 23:59:59']
    );
    
    // 获取按菜品分类的销售数据
    const [categorySales] = await pool.query(
      `SELECT 
          mc.name AS category_name,
          SUM(oi.quantity) AS total_quantity,
          SUM(oi.subtotal) AS total_sales
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN menu_categories mc ON mi.category_id = mc.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.payment_status = 'paid' AND o.created_at BETWEEN ? AND ?
       GROUP BY mc.id, mc.name
       ORDER BY total_sales DESC`,
      [startDate, endDate + ' 23:59:59']
    );
    
    // 获取销售总额
    const [totalSales] = await pool.query(
      `SELECT 
          COUNT(*) AS total_orders,
          SUM(total_amount) AS total_revenue
       FROM orders
       WHERE payment_status = 'paid' AND created_at BETWEEN ? AND ?`,
      [startDate, endDate + ' 23:59:59']
    );
    
    res.json({
      dailySales,
      categorySales,
      summary: totalSales[0]
    });
  } catch (err) {
    console.error('获取销售数据错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   GET /api/reports/users
 * @desc    获取用户分析数据
 * @access  Private
 */
router.get('/users', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限执行此操作' });
    }
    
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = req.query.endDate || new Date().toISOString().split('T')[0];
    
    // 获取用户增长趋势
    const [userGrowth] = await pool.query(
      `SELECT 
          DATE(created_at) AS date,
          COUNT(*) AS new_users
       FROM users
       WHERE created_at BETWEEN ? AND ?
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [startDate, endDate + ' 23:59:59']
    );
    
    // 获取用户订单统计
    const [userOrders] = await pool.query(
      `SELECT 
          u.id,
          u.name,
          COUNT(o.id) AS order_count,
          SUM(o.total_amount) AS total_spent,
          MAX(o.created_at) AS last_order_date
       FROM users u
       LEFT JOIN orders o ON u.id = o.user_id AND o.payment_status = 'paid'
       GROUP BY u.id, u.name
       ORDER BY total_spent DESC
       LIMIT 20`,
    );
    
    // 获取用户角色分布
    const [userRoles] = await pool.query(
      `SELECT 
          role,
          COUNT(*) AS count
       FROM users
       GROUP BY role`
    );
    
    res.json({
      userGrowth,
      userOrders,
      userRoles
    });
  } catch (err) {
    console.error('获取用户分析数据错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 