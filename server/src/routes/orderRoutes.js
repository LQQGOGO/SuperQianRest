const express = require('express');
const router = express.Router();
const { getOrders, getOrderDetail, createOrder, updateOrder, deleteOrder, getOrderStats } = require('../controllers/orderController');
const { auth, isAdmin, isStaffOrAdmin } = require('../middleware/auth');

// 获取订单列表
router.get('/list', auth, isStaffOrAdmin, getOrders);

// 获取订单详情
router.get('/detail/:id', auth, getOrderDetail);

// 创建订单
router.post('/create', auth, createOrder);

// 更新订单状态
router.put('/update/:id', auth, isStaffOrAdmin, updateOrder);

// 删除订单
router.delete('/delete/:id', auth, isAdmin, deleteOrder);

// 获取订单统计数据
router.get('/stats', auth, isStaffOrAdmin, getOrderStats);

module.exports = router; 