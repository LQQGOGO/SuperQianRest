const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authMiddleware, checkPermission } = require('../middlewares/auth.middleware');

// 所有订单路由都需要身份验证
router.use(authMiddleware);

// 获取订单列表
router.get('/list', checkPermission('order:view'), orderController.getOrderList);

// 获取订单统计数据
router.get('/stats', checkPermission('order:view'), orderController.getOrderStats);

// 创建订单
router.post('/create', checkPermission('order:add'), orderController.createOrder);

// 更新订单状态
router.put('/update/:id', checkPermission('order:edit'), orderController.updateOrder);

// 删除订单
router.delete('/delete/:id', checkPermission('order:delete'), orderController.deleteOrder);

module.exports = router; 