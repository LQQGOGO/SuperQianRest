const express = require('express');
const { pool, authenticateToken } = require('../app');

const router = express.Router();

/**
 * @route   GET /api/dashboard/workbench
 * @desc    获取工作台数据
 * @access  Private
 */
router.get('/workbench', authenticateToken, async (req, res) => {
  try {
    // 获取今日订单数
    const [todayOrdersResult] = await pool.query(
      'SELECT COUNT(*) AS today_orders FROM orders WHERE DATE(created_at) = CURDATE()'
    );
    
    // 获取今日销售额
    const [todaySalesResult] = await pool.query(
      'SELECT SUM(total_amount) AS today_sales FROM orders WHERE DATE(created_at) = CURDATE() AND payment_status = "paid"'
    );
    
    // 获取待处理订单数
    const [pendingOrdersResult] = await pool.query(
      'SELECT COUNT(*) AS pending_orders FROM orders WHERE status = "pending"'
    );
    
    // 获取最近10个订单
    const [recentOrders] = await pool.query(
      `SELECT o.id, o.order_number, o.total_amount, o.status, o.created_at, u.name AS customer_name
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );
    
    res.json({
      todayOrders: todayOrdersResult[0].today_orders || 0,
      todaySales: todaySalesResult[0].today_sales || 0,
      pendingOrders: pendingOrdersResult[0].pending_orders || 0,
      recentOrders
    });
  } catch (err) {
    console.error('获取工作台数据错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   GET /api/dashboard/analysis
 * @desc    获取分析页数据
 * @access  Private
 */
router.get('/analysis', authenticateToken, async (req, res) => {
  try {
    // 获取最近30天的销售趋势
    const [salesTrend] = await pool.query(
      `SELECT DATE(created_at) AS date, SUM(total_amount) AS daily_sales
       FROM orders
       WHERE payment_status = 'paid' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`
    );
    
    // 获取菜品销售排行
    const [topSellingItems] = await pool.query(
      `SELECT mi.id, mi.name, SUM(oi.quantity) AS total_sold, SUM(oi.subtotal) AS total_revenue
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.payment_status = 'paid' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY oi.menu_item_id
       ORDER BY total_sold DESC
       LIMIT 10`
    );
    
    // 获取分类销售占比
    const [categorySales] = await pool.query(
      `SELECT mc.name, SUM(oi.subtotal) AS total_sales
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN menu_categories mc ON mi.category_id = mc.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.payment_status = 'paid' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY mc.id
       ORDER BY total_sales DESC`
    );
    
    res.json({
      salesTrend,
      topSellingItems,
      categorySales
    });
  } catch (err) {
    console.error('获取分析页数据错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   GET /api/dashboard/monitor
 * @desc    获取监控页数据
 * @access  Private
 */
router.get('/monitor', authenticateToken, async (req, res) => {
  try {
    // 获取实时订单状态分布
    const [orderStatusDistribution] = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM orders
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
       GROUP BY status`
    );
    
    // 获取今日每小时订单量
    const [hourlyOrders] = await pool.query(
      `SELECT HOUR(created_at) AS hour, COUNT(*) AS order_count
       FROM orders
       WHERE DATE(created_at) = CURDATE()
       GROUP BY HOUR(created_at)
       ORDER BY hour`
    );
    
    // 获取系统状态
    const systemStatus = {
      cpu: Math.floor(Math.random() * 30) + 20, // 模拟CPU使用率 20-50%
      memory: Math.floor(Math.random() * 40) + 30, // 模拟内存使用率 30-70%
      disk: Math.floor(Math.random() * 20) + 10, // 模拟磁盘使用率 10-30%
      network: Math.floor(Math.random() * 50) + 20 // 模拟网络使用率 20-70%
    };
    
    res.json({
      orderStatusDistribution,
      hourlyOrders,
      systemStatus
    });
  } catch (err) {
    console.error('获取监控页数据错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 