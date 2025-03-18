const pool = require('../config/database');
const AppError = require('../utils/errorHandler');

// 获取销售数据
exports.getSalesData = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    // 默认为过去30天
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    
    const start = startDate || defaultStartDate.toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];
    
    let timeFormat, groupByClause;
    
    // 根据分组类型设置SQL
    switch (groupBy) {
      case 'hour':
        timeFormat = '%Y-%m-%d %H:00:00';
        groupByClause = 'DATE_FORMAT(created_at, "%Y-%m-%d %H:00:00")';
        break;
      case 'day':
        timeFormat = '%Y-%m-%d';
        groupByClause = 'DATE(created_at)';
        break;
      case 'week':
        timeFormat = '%x-%v'; // ISO年-周数
        groupByClause = 'YEARWEEK(created_at, 1)';
        break;
      case 'month':
        timeFormat = '%Y-%m';
        groupByClause = 'DATE_FORMAT(created_at, "%Y-%m")';
        break;
      default:
        timeFormat = '%Y-%m-%d';
        groupByClause = 'DATE(created_at)';
    }
    
    // 获取销售数据
    const [salesData] = await pool.query(
      `SELECT 
        DATE_FORMAT(created_at, ?) as time_period,
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales
       FROM orders
       WHERE created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
       AND status != 'cancelled'
       GROUP BY ${groupByClause}
       ORDER BY time_period`,
      [timeFormat, start, end]
    );
    
    // 获取热门商品
    const [topItems] = await pool.query(
      `SELECT 
        m.id, m.name, 
        SUM(oi.quantity) as total_quantity,
        SUM(oi.quantity * oi.price) as total_sales
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN menus m ON oi.menu_id = m.id
       WHERE o.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
       AND o.status != 'cancelled'
       GROUP BY m.id, m.name
       ORDER BY total_quantity DESC
       LIMIT 10`,
      [start, end]
    );
    
    // 获取销售总额
    const [totalSales] = await pool.query(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_amount
       FROM orders
       WHERE created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
       AND status != 'cancelled'`,
      [start, end]
    );
    
    res.status(200).json({
      salesData,
      topItems,
      summary: totalSales[0],
      timeRange: {
        start,
        end
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取用户分析数据
exports.getUserAnalysis = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    // 默认为过去30天
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    
    const start = startDate || defaultStartDate.toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];
    
    // 获取用户增长数据
    const [userGrowth] = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users
       FROM users
       WHERE created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [start, end]
    );
    
    // 获取用户角色分布
    const [userRoles] = await pool.query(
      `SELECT 
        role,
        COUNT(*) as count
       FROM users
       GROUP BY role`
    );
    
    // 获取活跃用户（有订单的用户）
    const [activeUsers] = await pool.query(
      `SELECT 
        COUNT(DISTINCT user_id) as active_users
       FROM orders
       WHERE created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)`,
      [start, end]
    );
    
    // 获取用户消费排行
    const [topUsers] = await pool.query(
      `SELECT 
        u.id, u.username, u.name,
        COUNT(o.id) as order_count,
        SUM(o.total_amount) as total_spent
       FROM users u
       JOIN orders o ON u.id = o.user_id
       WHERE o.created_at BETWEEN ? AND DATE_ADD(?, INTERVAL 1 DAY)
       AND o.status != 'cancelled'
       GROUP BY u.id, u.username, u.name
       ORDER BY total_spent DESC
       LIMIT 10`,
      [start, end]
    );
    
    res.status(200).json({
      userGrowth,
      userRoles,
      activeUsers: activeUsers[0].active_users,
      topUsers,
      timeRange: {
        start,
        end
      }
    });
  } catch (error) {
    next(error);
  }
}; 