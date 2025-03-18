const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// 登录
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ status: 'fail', message: '请提供用户名和密码' });
    }

    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(401).json({ status: 'fail', message: '用户名或密码错误' });
    }

    const isMatch = await User.comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ status: 'fail', message: '用户名或密码错误' });
    }

    if (user.status !== 1) {
      return res.status(401).json({ status: 'fail', message: '账户已被禁用' });
    }

    // 创建JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      adminInfo: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 获取当前用户信息
const getUserInfo = async (req, res) => {
  console.log('收到获取用户信息请求，用户ID:', req.user?.id);
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: 'fail', message: '用户不存在' });
    }

    // 根据角色分配权限
    let permissions = [];

    if (user.role === 'admin') {
      permissions = [
        'menu:view',
        'menu:add',
        'menu:edit',
        'menu:delete',
        'category:view',
        'category:add',
        'category:edit',
        'category:delete',
        'order:view',
        'order:add',
        'order:edit',
        'order:delete',
        'user:view',
        'user:add',
        'user:edit',
        'user:delete',
        'report:view',
        'setting:view',
        'setting:edit',
      ];
    } else if (user.role === 'staff') {
      permissions = ['menu:view', 'order:view', 'order:edit', 'category:view', 'report:view'];
    } else {
      permissions = ['menu:view', 'order:add', 'order:view'];
    }

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      permissions,
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 重置管理员密码
const resetAdminPassword = async (req, res) => {
  try {
    const { username, newPassword, resetCode } = req.body;
    
    if (!username || !newPassword || !resetCode) {
      return res.status(400).json({ status: 'fail', message: '请提供所有必要字段' });
    }
    
    if (resetCode !== process.env.RESET_CODE) {
      return res.status(401).json({ status: 'fail', message: '重置码无效' });
    }
    
    const user = await User.findByUsername(username);
    
    if (!user) {
      return res.status(404).json({ status: 'fail', message: '用户不存在' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: '只能重置管理员密码' });
    }
    
    await User.update(user.id, { password: newPassword });
    
    res.json({
      message: '管理员密码重置成功',
      username: user.username,
    });
  } catch (error) {
    console.error('重置密码错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

module.exports = {
  login,
  getUserInfo,
  resetAdminPassword,
};
