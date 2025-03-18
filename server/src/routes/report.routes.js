const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authMiddleware, checkPermission } = require('../middlewares/auth.middleware');

// 所有报表路由都需要身份验证
router.use(authMiddleware);

// 获取销售数据
router.get('/sales-data', checkPermission('report:view'), reportController.getSalesData);

// 获取用户分析数据
router.get('/user-analysis', checkPermission('report:view'), reportController.getUserAnalysis);

module.exports = router; 