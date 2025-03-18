const express = require('express');
const { pool } = require('../models/db');
const { authenticateToken } = require('../middlewares/auth');
const { ApiError } = require('../middlewares/errorHandler');

const router = express.Router();

/**
 * @route   GET /api/dashboard/workbench
 * @desc    获取工作台数据
 * @access  Private
 */
router.get('/workbench', authenticateToken, async (req, res, next) => {
  try {
    // 获取今日订单数量
    const today = new Date().toISOString().split('T')[0];
    const [todayOrdersResult] = await pool.query(
      'SELECT COUNT(*) as count, SUM(total_amount) as total FROM orders WHERE DATE(created_at) = ?',
      [today]
    );
    
    // 获取待处理订单数量
    const [pendingOrdersResult] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE status = "pending"'
    );
    
    // 获取最近订单
    const [recentOrders] = await pool.query(
      `SELECT o.id, o.order_number, o.total_amount, o.status, o.created_at, u.name as customer_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );
    
    res.json({
      todayOrders: todayOrdersResult[0].count || 0,
      todaySales: todayOrdersResult[0].total || 0,
      pendingOrders: pendingOrdersResult[0].count || 0,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/dashboard/analysis
 * @desc    获取分析页数据
 * @access  Private
 */
router.get('/analysis', authenticateToken, async (req, res, next) => {
  try {
    // 获取销售趋势（最近7天）
    const [salesTrend] = await pool.query(
      `SELECT 
          DATE(created_at) as date,
          SUM(total_amount) as daily_sales
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`
    );
    
    // 获取热销商品
    const [topSellingItems] = await pool.query(
      `SELECT 
          mi.id,
          mi.name,
          SUM(oi.quantity) as total_sold,
          SUM(oi.subtotal) as total_revenue
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY mi.id, mi.name
       ORDER BY total_sold DESC
       LIMIT 5`
    );
    
    // 获取分类销售
    const [categorySales] = await pool.query(
      `SELECT 
          mc.name,
          SUM(oi.subtotal) as total_sales
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN menu_categories mc ON mi.category_id = mc.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY mc.name
       ORDER BY total_sales DESC`
    );
    
    res.json({
      salesTrend,
      topSellingItems,
      categorySales
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/dashboard/monitor
 * @desc    获取监控页数据
 * @access  Private
 */
router.get('/monitor', authenticateToken, async (req, res, next) => {
  try {
    // 获取订单状态分布
    const [orderStatusDistribution] = await pool.query(
      `SELECT 
          status,
          COUNT(*) as count
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY status`
    );
    
    // 获取每小时订单数量（今日）
    const today = new Date().toISOString().split('T')[0];
    const [hourlyOrders] = await pool.query(
      `SELECT 
          HOUR(created_at) as hour,
          COUNT(*) as order_count
       FROM orders
       WHERE DATE(created_at) = ?
       GROUP BY HOUR(created_at)
       ORDER BY hour`,
      [today]
    );
    
    // 系统状态（模拟数据）
    const systemStatus = {
      cpu: Math.floor(Math.random() * 60) + 10,
      memory: Math.floor(Math.random() * 50) + 20,
      disk: Math.floor(Math.random() * 30) + 10,
      network: Math.floor(Math.random() * 40) + 20
    };
    
    res.json({
      orderStatusDistribution,
      hourlyOrders,
      systemStatus
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 