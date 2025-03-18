const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const { authMiddleware, checkPermission } = require('../middlewares/auth.middleware');

// 所有菜单路由都需要身份验证
router.use(authMiddleware);

// 获取所有菜单
router.get('/list', menuController.getAllMenus);

// 添加新菜单
router.post('/add', checkPermission('menu:add'), menuController.addMenu);

// 更新菜单
router.put('/update/:id', checkPermission('menu:edit'), menuController.updateMenu);

// 删除菜单
router.delete('/delete/:id', checkPermission('menu:delete'), menuController.deleteMenu);

module.exports = router; 