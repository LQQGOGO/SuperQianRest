const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// 登录
router.post('/login', authController.login);

// 获取当前管理员信息
router.get('/info', authMiddleware, authController.getAdminInfo);

// 重置管理员密码
router.post('/reset-admin', authController.resetAdminPassword);

module.exports = router; 