const User = require('../models/userModel');
const Order = require('../models/orderModel');

// 获取个人信息
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ status: 'fail', message: '用户不存在' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('获取个人信息错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 更新个人信息
const updateProfile = async (req, res) => {
  try {
    const { name, phone, email, avatar } = req.body;
    
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (avatar !== undefined) updateData.avatar = avatar;
    
    const updatedUser = await User.update(req.user.id, updateData);
    
    res.json({
      message: '个人信息更新成功',
      user: updatedUser
    });
  } catch (error) {
    console.error('更新个人信息错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 修改密码
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ status: 'fail', message: '请提供旧密码和新密码' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ status: 'fail', message: '用户不存在' });
    }
    
    // 验证旧密码
    const isMatch = await User.comparePassword(oldPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ status: 'fail', message: '旧密码不正确' });
    }
    
    // 更新密码
    await User.update(req.user.id, { password: newPassword });
    
    res.json({
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 获取我的订单
const getMyOrders = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    
    const orders = await Order.getAll({
      user_id: req.user.id,
      status,
      page,
      limit
    });
    
    res.json(orders);
  } catch (error) {
    console.error('获取我的订单错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getMyOrders
}; 