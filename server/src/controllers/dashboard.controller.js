const pool = require('../config/database');
const AppError = require('../utils/errorHandler');

// 获取工作台数据
exports.getWorkbenchData = async (req, res, next) => {
  try {
    // 获取今日订单数
    const [todayOrders] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()'
    );

    // 获取今日销售额
    const [todaySales] = await pool.query(
      'SELECT SUM(total_amount) as total FROM orders WHERE DATE(created_at) = CURDATE() AND status != "cancelled"'
    );

    // 获取待处理订单数
    const [pendingOrders] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE status = "pending"'
    );

    // 获取用户总数
    const [totalUsers] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE role = "customer"'
    );

    // 获取最近5个订单
    const [recentOrders] = await pool.query(
      `SELECT o.id, o.order_number, o.total_amount, o.status, o.created_at, u.username 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC 
       LIMIT 5`
    );

    res.status(200).json({
      todayOrderCount: todayOrders[0].count,
      todaySales: todaySales[0].total || 0,
      pendingOrderCount: pendingOrders[0].count,
      totalUserCount: totalUsers[0].count,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

// 获取分析数据
exports.getAnalysisData = async (req, res, next) => {
  try {
    // 获取过去7天的销售数据
    const [weeklySales] = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as total,
        COUNT(*) as count
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       AND status != "cancelled"
       GROUP BY DATE(created_at)
       ORDER BY date`
    );

    // 获取订单状态分布
    const [orderStatusDistribution] = await pool.query(
      `SELECT 
        status,
        COUNT(*) as count
       FROM orders
       GROUP BY status`
    );

    // 获取用户增长数据
    const [userGrowth] = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
       FROM users
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`
    );

    res.status(200).json({
      weeklySales,
      orderStatusDistribution,
      userGrowth
    });
  } catch (error) {
    next(error);
  }
};

// 获取监控数据
exports.getMonitorData = async (req, res, next) => {
  try {
    // 获取实时订单数据（最近24小时）
    const [realtimeOrders] = await pool.query(
      `SELECT 
        HOUR(created_at) as hour,
        COUNT(*) as count
       FROM orders
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
       GROUP BY HOUR(created_at)
       ORDER BY hour`
    );

    // 获取系统状态
    const systemStatus = {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100),
      uptime: Math.floor(Math.random() * 30) + 1
    };

    // 获取活跃用户数
    const [activeUsers] = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as count
       FROM orders
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`
    );

    res.status(200).json({
      realtimeOrders,
      systemStatus,
      activeUsers: activeUsers[0].count
    });
  } catch (error) {
    next(error);
  }
}; 