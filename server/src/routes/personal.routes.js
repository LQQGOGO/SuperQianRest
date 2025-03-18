const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personal.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// 所有个人中心路由都需要身份验证
router.use(authMiddleware);

// 获取当前用户资料
router.get('/profile', personalController.getUserProfile);

// 获取用户消息通知
router.get('/messages', personalController.getUserMessages);

module.exports = router; 