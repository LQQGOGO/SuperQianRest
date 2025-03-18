const express = require('express');
const { login, getUserInfo, resetPassword, forgotPassword } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { userSchemas } = require('../utils/validationSchemas');

const router = express.Router();

// 登录路由
router.post('/login', validate(userSchemas.login), login);

// 获取用户信息
router.get('/info', authenticateToken, getUserInfo);

// 重置密码
router.post('/reset-password', validate(userSchemas.resetPassword), resetPassword);

// 忘记密码
router.post('/forgot-password', validate(userSchemas.forgotPassword), forgotPassword);

module.exports = router; 