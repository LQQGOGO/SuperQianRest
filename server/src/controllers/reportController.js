const Order = require('../models/orderModel');
const db = require('../config/db');

// 获取销售报表
const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ status: 'fail', message: '请提供开始和结束日期' });
    }
    
    // 获取每日销售数据
    const [dailySales] = await db.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales,
        AVG(total_amount) as average_order_value
       FROM orders
       WHERE DATE(created_at) BETWEEN ? AND ?
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [startDate, endDate]
    );
    
    // 获取热门菜品
    const [topItems] = await db.query(
      `SELECT 
        oi.menu_item_id,
        oi.menu_item_name,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.subtotal) as total_sales
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE DATE(o.created_at) BETWEEN ? AND ?
       GROUP BY oi.menu_item_id, oi.menu_item_name
       ORDER BY total_quantity DESC
       LIMIT 10`,
      [startDate, endDate]
    );
    
    // 获取分类销售数据
    const [categorySales] = await db.query(
      `SELECT 
        c.id as category_id,
        c.name as category_name,
        COUNT(DISTINCT o.id) as order_count,
        SUM(oi.quantity) as item_count,
        SUM(oi.subtotal) as total_sales
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN menu_categories c ON mi.category_id = c.id
       WHERE DATE(o.created_at) BETWEEN ? AND ?
       GROUP BY c.id, c.name
       ORDER BY total_sales DESC`,
      [startDate, endDate]
    );
    
    // 获取总计
    const [totals] = await db.query(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_sales,
        AVG(total_amount) as average_order_value
       FROM orders
       WHERE DATE(created_at) BETWEEN ? AND ?`,
      [startDate, endDate]
    );
    
    res.json({
      dailySales,
      topItems,
      categorySales,
      totals: totals[0]
    });
  } catch (error) {
    console.error('获取销售报表错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

module.exports = {
  getSalesReport
}; 