const express = require('express');
const router = express.Router();
const { getCategories, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { auth, isAdmin } = require('../middleware/auth');

// 获取所有分类
router.get('/list', auth, getCategories);

// 添加分类
router.post('/add', auth, isAdmin, addCategory);

// 更新分类
router.put('/update/:id', auth, isAdmin, updateCategory);

// 删除分类
router.delete('/delete/:id', auth, isAdmin, deleteCategory);

module.exports = router; 