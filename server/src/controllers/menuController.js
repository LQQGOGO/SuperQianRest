const MenuItem = require('../models/menuModel');

// 获取菜单列表
const getMenuItems = async (req, res) => {
  try {
    const { category_id, search, page, limit } = req.query;
    
    const menuItems = await MenuItem.getAll({
      category_id,
      search,
      page,
      limit
    });
    
    res.json(menuItems);
  } catch (error) {
    console.error('获取菜单列表错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 添加菜单项
const addMenuItem = async (req, res) => {
  try {
    const { name, price, description, category_id, image, is_special, is_available } = req.body;
    
    if (!name || !price || !category_id) {
      return res.status(400).json({ status: 'fail', message: '请提供必要字段' });
    }
    
    const newMenuItem = await MenuItem.create({
      name,
      price,
      description,
      category_id,
      image,
      is_special,
      is_available
    });
    
    res.status(201).json({
      message: '菜单项添加成功',
      menuItem: newMenuItem
    });
  } catch (error) {
    console.error('添加菜单项错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 更新菜单项
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const menuItem = await MenuItem.getById(id);
    
    if (!menuItem) {
      return res.status(404).json({ status: 'fail', message: '菜单项不存在' });
    }
    
    const updatedMenuItem = await MenuItem.update(id, updateData);
    
    res.json({
      message: '菜单项更新成功',
      menuItem: updatedMenuItem
    });
  } catch (error) {
    console.error('更新菜单项错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 删除菜单项
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const menuItem = await MenuItem.getById(id);
    
    if (!menuItem) {
      return res.status(404).json({ status: 'fail', message: '菜单项不存在' });
    }
    
    await MenuItem.delete(id);
    
    res.json({
      message: '菜单项删除成功',
      id
    });
  } catch (error) {
    console.error('删除菜单项错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

module.exports = {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
}; 