const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, getMyOrders } = require('../controllers/personalController');
const { auth } = require('../middleware/auth');

// 获取个人信息
router.get('/profile', auth, getProfile);

// 更新个人信息
router.put('/profile', auth, updateProfile);

// 修改密码
router.post('/change-password', auth, changePassword);

// 获取我的订单
router.get('/orders', auth, getMyOrders);

module.exports = router; 