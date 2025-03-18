const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

// 获取用户列表
router.get('/list', auth, isAdmin, getUsers);

// 创建用户
router.post('/add', auth, isAdmin, createUser);

// 更新用户
router.put('/update/:id', auth, isAdmin, updateUser);

// 删除用户
router.delete('/delete/:id', auth, isAdmin, deleteUser);

module.exports = router; 