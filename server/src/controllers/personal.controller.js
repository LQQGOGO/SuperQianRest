const pool = require('../config/database');
const AppError = require('../utils/errorHandler');

// 获取当前用户资料
exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 获取用户信息
    const [users] = await pool.query(
      `SELECT id, username, name, phone, email, role, avatar, created_at, updated_at
       FROM users
       WHERE id = ?`,
      [userId]
    );
    
    if (users.length === 0) {
      return next(new AppError('用户不存在', 404));
    }
    
    // 获取用户订单统计
    const [orderStats] = await pool.query(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(total_amount) as total_spent
       FROM orders
       WHERE user_id = ?`,
      [userId]
    );
    
    res.status(200).json({
      profile: users[0],
      stats: orderStats[0]
    });
  } catch (error) {
    next(error);
  }
};

// 获取用户消息通知
exports.getUserMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, read, type } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT id, title, content, is_read, type, created_at
      FROM notifications
      WHERE user_id = ?
    `;
    
    const queryParams = [userId];
    
    // 添加筛选条件
    if (read !== undefined) {
      query += ` AND is_read = ?`;
      queryParams.push(read === 'true' ? 1 : 0);
    }
    
    if (type) {
      query += ` AND type = ?`;
      queryParams.push(type);
    }
    
    // 添加排序和分页
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // 执行查询
    const [messages] = await pool.query(query, queryParams);
    
    // 获取总数
    let countQuery = `
      SELECT COUNT(*) as total
      FROM notifications
      WHERE user_id = ?
    `;
    
    const countParams = [userId];
    
    // 添加相同的筛选条件
    if (read !== undefined) {
      countQuery += ` AND is_read = ?`;
      countParams.push(read === 'true' ? 1 : 0);
    }
    
    if (type) {
      countQuery += ` AND type = ?`;
      countParams.push(type);
    }
    
    const [totalResult] = await pool.query(countQuery, countParams);
    
    // 获取未读消息数
    const [unreadCount] = await pool.query(
      `SELECT COUNT(*) as count
       FROM notifications
       WHERE user_id = ? AND is_read = 0`,
      [userId]
    );
    
    res.status(200).json({
      total: totalResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      unread: unreadCount[0].count,
      items: messages
    });
  } catch (error) {
    next(error);
  }
}; 