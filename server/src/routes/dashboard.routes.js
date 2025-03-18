const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// 所有 dashboard 路由都需要身份验证
router.use(authMiddleware);

// 获取工作台数据
router.get('/workbench', dashboardController.getWorkbenchData);

// 获取分析数据
router.get('/analysis', dashboardController.getAnalysisData);

// 获取监控数据
router.get('/monitor', dashboardController.getMonitorData);

module.exports = router; 