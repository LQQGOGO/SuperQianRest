const Category = require('../models/categoryModel');

// 获取所有分类
const getCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    console.error('获取分类列表错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 添加分类
const addCategory = async (req, res) => {
  try {
    const { name, description, image, sort_order, status } = req.body;
    
    if (!name) {
      return res.status(400).json({ status: 'fail', message: '请提供分类名称' });
    }
    
    const newCategory = await Category.create({
      name,
      description,
      image,
      sort_order,
      status
    });
    
    res.status(201).json({
      message: '分类添加成功',
      category: newCategory
    });
  } catch (error) {
    console.error('添加分类错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 更新分类
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const category = await Category.getById(id);
    
    if (!category) {
      return res.status(404).json({ status: 'fail', message: '分类不存在' });
    }
    
    const updatedCategory = await Category.update(id, updateData);
    
    res.json({
      message: '分类更新成功',
      category: updatedCategory
    });
  } catch (error) {
    console.error('更新分类错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 删除分类
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.getById(id);
    
    if (!category) {
      return res.status(404).json({ status: 'fail', message: '分类不存在' });
    }
    
    try {
      await Category.delete(id);
      
      res.json({
        message: '分类删除成功',
        id
      });
    } catch (error) {
      if (error.message.includes('无法删除分类')) {
        return res.status(400).json({ status: 'fail', message: error.message });
      }
      throw error;
    }
  } catch (error) {
    console.error('删除分类错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
}; 