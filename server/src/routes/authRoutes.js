const express = require('express');
const router = express.Router();
const { login, getUserInfo, resetAdminPassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// 登录
router.post('/login', login);

// 获取当前用户信息
router.get('/info', auth, getUserInfo);

// 重置管理员密码
router.post('/reset-admin', resetAdminPassword);

module.exports = router; 