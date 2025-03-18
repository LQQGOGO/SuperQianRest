const express = require('express');
const router = express.Router();
const { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { auth, isAdmin, isStaffOrAdmin } = require('../middleware/auth');

// 获取菜单列表
router.get('/list', auth, getMenuItems);

// 添加菜单项
router.post('/add', auth, isAdmin, addMenuItem);

// 更新菜单项
router.put('/update/:id', auth, isAdmin, updateMenuItem);

// 删除菜单项
router.delete('/delete/:id', auth, isAdmin, deleteMenuItem);

module.exports = router; 