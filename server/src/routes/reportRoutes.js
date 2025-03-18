const express = require('express');
const router = express.Router();
const { getSalesReport } = require('../controllers/reportController');
const { auth, isStaffOrAdmin } = require('../middleware/auth');

// 获取销售报表
router.get('/sales', auth, isStaffOrAdmin, getSalesReport);

module.exports = router; 