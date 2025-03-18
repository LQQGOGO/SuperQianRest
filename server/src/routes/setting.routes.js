const express = require('express');
const router = express.Router();
const settingController = require('../controllers/setting.controller');
const { authMiddleware, checkPermission } = require('../middlewares/auth.middleware');

// 所有系统设置路由都需要身份验证
router.use(authMiddleware);

// 获取店铺信息
router.get('/basic-info', settingController.getShopInfo);

// 更新店铺信息
router.put('/update', checkPermission('setting:edit'), settingController.updateShopInfo);

module.exports = router; 