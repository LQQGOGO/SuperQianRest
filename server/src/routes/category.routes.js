const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authMiddleware, checkPermission } = require('../middlewares/auth.middleware');

// 所有分类路由都需要身份验证
router.use(authMiddleware);

// 获取所有分类
router.get('/list', categoryController.getAllCategories);

// 添加新分类
router.post('/add', checkPermission('category:add'), categoryController.addCategory);

// 更新分类
router.put('/update/:id', checkPermission('category:edit'), categoryController.updateCategory);

// 删除分类
router.delete('/delete/:id', checkPermission('category:delete'), categoryController.deleteCategory);

module.exports = router; 