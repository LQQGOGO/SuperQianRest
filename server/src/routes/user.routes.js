const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware, checkPermission } = require('../middlewares/auth.middleware');

// 所有用户路由都需要身份验证
router.use(authMiddleware);

// 获取用户列表
router.get('/list', checkPermission('user:view'), userController.getUserList);

// 创建用户
router.post('/create', checkPermission('user:add'), userController.createUser);

// 更新用户信息
router.put('/update/:id', checkPermission('user:edit'), userController.updateUser);

// 删除用户
router.delete('/delete/:id', checkPermission('user:delete'), userController.deleteUser);

module.exports = router; 