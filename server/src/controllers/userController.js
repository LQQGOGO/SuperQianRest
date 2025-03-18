const User = require('../models/userModel');

// 获取用户列表
const getUsers = async (req, res) => {
  try {
    const { role, search, page, limit } = req.query;
    
    const users = await User.getAll({
      role,
      search,
      page,
      limit
    });
    
    res.json(users);
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 创建用户
const createUser = async (req, res) => {
  try {
    const { username, password, name, phone, email, role, avatar, status } = req.body;
    
    if (!username || !password || !name) {
      return res.status(400).json({ status: 'fail', message: '请提供必要字段' });
    }
    
    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    
    if (existingUser) {
      return res.status(400).json({ status: 'fail', message: '用户名已存在' });
    }
    
    const newUser = await User.create({
      username,
      password,
      name,
      phone,
      email,
      role,
      avatar,
      status
    });
    
    res.status(201).json({
      message: '用户创建成功',
      user: newUser
    });
  } catch (error) {
    console.error('创建用户错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 更新用户
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ status: 'fail', message: '用户不存在' });
    }
    
    // 如果尝试更新用户名，检查是否已存在
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await User.findByUsername(updateData.username);
      
      if (existingUser) {
        return res.status(400).json({ status: 'fail', message: '用户名已存在' });
      }
    }
    
    const updatedUser = await User.update(id, updateData);
    
    res.json({
      message: '用户更新成功',
      user: updatedUser
    });
  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 删除用户
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ status: 'fail', message: '用户不存在' });
    }
    
    // 防止删除自己
    if (req.user && req.user.id === parseInt(id)) {
      return res.status(400).json({ status: 'fail', message: '不能删除当前登录的用户' });
    }
    
    await User.delete(id);
    
    res.json({
      message: '用户删除成功',
      id
    });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
}; 