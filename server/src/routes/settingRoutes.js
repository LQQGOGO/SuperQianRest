const express = require('express');
const router = express.Router();
const { getShopInfo, updateShopInfo } = require('../controllers/settingController');
const { auth, isAdmin } = require('../middleware/auth');

// 获取店铺信息
router.get('/shop-info', auth, getShopInfo);

// 更新店铺信息
router.put('/update', auth, isAdmin, updateShopInfo);

module.exports = router; 