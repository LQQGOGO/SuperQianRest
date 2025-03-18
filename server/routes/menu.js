const express = require('express');
const { pool } = require('../models/db');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

/**
 * @route   GET /api/menu
 * @desc    获取所有菜单项
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [menuItems] = await pool.query(
      `SELECT mi.*, mc.name AS category_name
       FROM menu_items mi
       LEFT JOIN menu_categories mc ON mi.category_id = mc.id
       ORDER BY mc.sort_order, mi.name`
    );
    
    res.json(menuItems);
  } catch (err) {
    console.error('获取菜单列表错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   GET /api/menu/:id
 * @desc    获取单个菜单项
 * @access  Private
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [menuItems] = await pool.query(
      `SELECT mi.*, mc.name AS category_name
       FROM menu_items mi
       LEFT JOIN menu_categories mc ON mi.category_id = mc.id
       WHERE mi.id = ?`,
      [req.params.id]
    );
    
    if (menuItems.length === 0) {
      return res.status(404).json({ message: '菜单项不存在' });
    }
    
    res.json(menuItems[0]);
  } catch (err) {
    console.error('获取菜单项错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   POST /api/menu
 * @desc    添加菜单项
 * @access  Private
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限执行此操作' });
    }
    
    const { category_id, name, description, price, image, is_special, is_available } = req.body;
    
    // 验证请求体
    if (!name || !price) {
      return res.status(400).json({ message: '菜品名称和价格为必填项' });
    }
    
    const [result] = await pool.query(
      `INSERT INTO menu_items (category_id, name, description, price, image, is_special, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, description, price, image, is_special || 0, is_available || 1]
    );
    
    const [newMenuItem] = await pool.query(
      'SELECT * FROM menu_items WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newMenuItem[0]);
  } catch (err) {
    console.error('添加菜单项错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   PUT /api/menu/:id
 * @desc    更新菜单项
 * @access  Private
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限执行此操作' });
    }
    
    const { category_id, name, description, price, image, is_special, is_available } = req.body;
    
    // 验证请求体
    if (!name || !price) {
      return res.status(400).json({ message: '菜品名称和价格为必填项' });
    }
    
    // 检查菜单项是否存在
    const [existingItems] = await pool.query(
      'SELECT id FROM menu_items WHERE id = ?',
      [req.params.id]
    );
    
    if (existingItems.length === 0) {
      return res.status(404).json({ message: '菜单项不存在' });
    }
    
    await pool.query(
      `UPDATE menu_items
       SET category_id = ?, name = ?, description = ?, price = ?, image = ?, is_special = ?, is_available = ?
       WHERE id = ?`,
      [category_id, name, description, price, image, is_special, is_available, req.params.id]
    );
    
    const [updatedMenuItem] = await pool.query(
      'SELECT * FROM menu_items WHERE id = ?',
      [req.params.id]
    );
    
    res.json(updatedMenuItem[0]);
  } catch (err) {
    console.error('更新菜单项错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   DELETE /api/menu/:id
 * @desc    删除菜单项
 * @access  Private
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限执行此操作' });
    }
    
    // 检查菜单项是否存在
    const [existingItems] = await pool.query(
      'SELECT id FROM menu_items WHERE id = ?',
      [req.params.id]
    );
    
    if (existingItems.length === 0) {
      return res.status(404).json({ message: '菜单项不存在' });
    }
    
    await pool.query(
      'DELETE FROM menu_items WHERE id = ?',
      [req.params.id]
    );
    
    res.json({ message: '菜单项已成功删除' });
  } catch (err) {
    console.error('删除菜单项错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   GET /api/menu/categories
 * @desc    获取所有菜单分类
 * @access  Private
 */
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM menu_categories ORDER BY sort_order'
    );
    
    res.json(categories);
  } catch (err) {
    console.error('获取菜单分类错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

/**
 * @route   POST /api/menu/categories
 * @desc    添加菜单分类
 * @access  Private
 */
router.post('/categories', authenticateToken, async (req, res) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '没有权限执行此操作' });
    }
    
    const { name, description, image, sort_order, status } = req.body;
    
    // 验证请求体
    if (!name) {
      return res.status(400).json({ message: '分类名称为必填项' });
    }
    
    const [result] = await pool.query(
      `INSERT INTO menu_categories (name, description, image, sort_order, status)
       VALUES (?, ?, ?, ?, ?)`,
      [name, description, image, sort_order || 0, status || 1]
    );
    
    const [newCategory] = await pool.query(
      'SELECT * FROM menu_categories WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newCategory[0]);
  } catch (err) {
    console.error('添加菜单分类错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 