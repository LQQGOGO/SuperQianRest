const Order = require('../models/orderModel');

// 获取订单列表
const getOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, search, page, limit } = req.query;
    
    const orders = await Order.getAll({
      status,
      startDate,
      endDate,
      search,
      page,
      limit
    });
    
    res.json(orders);
  } catch (error) {
    console.error('获取订单列表错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 获取订单详情
const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.getById(id);
    
    if (!order) {
      return res.status(404).json({ status: 'fail', message: '订单不存在' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('获取订单详情错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 创建订单
const createOrder = async (req, res) => {
  try {
    const { user_id, items, total_amount, address, phone, notes, payment_method } = req.body;
    
    if (!user_id || !items || !total_amount) {
      return res.status(400).json({ status: 'fail', message: '请提供必要字段' });
    }
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ status: 'fail', message: '订单项不能为空' });
    }
    
    // 验证订单项
    for (const item of items) {
      if (!item.menu_id || !item.quantity || !item.price) {
        return res.status(400).json({ status: 'fail', message: '订单项缺少必要字段' });
      }
    }
    
    const newOrder = await Order.create({
      user_id,
      items,
      total_amount,
      address,
      phone,
      notes,
      payment_method
    });
    
    res.status(201).json({
      message: '订单创建成功',
      order: newOrder
    });
  } catch (error) {
    console.error('创建订单错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 更新订单状态
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const orderDetail = await Order.getById(id);
    
    if (!orderDetail) {
      return res.status(404).json({ status: 'fail', message: '订单不存在' });
    }
    
    const updatedOrder = await Order.update(id, updateData);
    
    res.json({
      message: '订单更新成功',
      order: updatedOrder
    });
  } catch (error) {
    console.error('更新订单错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 删除订单
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderDetail = await Order.getById(id);
    
    if (!orderDetail) {
      return res.status(404).json({ status: 'fail', message: '订单不存在' });
    }
    
    await Order.delete(id);
    
    res.json({
      message: '订单删除成功',
      id
    });
  } catch (error) {
    console.error('删除订单错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 获取订单统计数据
const getOrderStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await Order.getStats({
      startDate,
      endDate
    });
    
    res.json(stats);
  } catch (error) {
    console.error('获取订单统计错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

module.exports = {
  getOrders,
  getOrderDetail,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats
}; 