const express = require('express');
const router = express.Router();

// 导入路由模块
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const menuRoutes = require('./menu.routes');
const categoryRoutes = require('./category.routes');
const orderRoutes = require('./order.routes');
const userRoutes = require('./user.routes');
const reportRoutes = require('./report.routes');
const personalRoutes = require('./personal.routes');
const settingRoutes = require('./setting.routes');

// 基础路由
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: '服务正常运行' });
});

// 使用路由模块
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/menu', menuRoutes);
router.use('/category', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/report', reportRoutes);
router.use('/personal', personalRoutes);
router.use('/setting', settingRoutes);

module.exports = router; 