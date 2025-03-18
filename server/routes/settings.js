const express = require('express');
const { pool } = require('../models/db');
const { authenticateToken } = require('../middlewares/auth');
const { ApiError } = require('../middlewares/errorHandler');

const router = express.Router();

/**
 * @route   GET /api/settings/shop
 * @desc    获取店铺设置
 * @access  Private
 */
router.get('/shop', authenticateToken, async (req, res, next) => {
  try {
    // 获取店铺设置
    const [shopSettings] = await pool.query('SELECT * FROM shop_settings WHERE id = 1');
    
    if (shopSettings.length === 0) {
      // 如果没有设置，返回默认值
      return res.json({
        id: 1,
        shop_name: '美味餐厅',
        logo: 'logo.jpg',
        address: '北京市海淀区中关村大街1号',
        phone: '010-12345678',
        email: 'contact@restaurant.com',
        business_hours: '09:00-22:00',
        description: '提供各类美食，欢迎光临'
      });
    }
    
    res.json(shopSettings[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/settings/shop
 * @desc    更新店铺设置
 * @access  Private
 */
router.put('/shop', authenticateToken, async (req, res, next) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      throw new ApiError(403, '没有权限执行此操作');
    }
    
    const { 
      shop_name, 
      logo, 
      address, 
      phone, 
      email, 
      business_hours, 
      description 
    } = req.body;
    
    // 检查是否已有设置
    const [existingSettings] = await pool.query('SELECT id FROM shop_settings WHERE id = 1');
    
    if (existingSettings.length === 0) {
      // 如果没有设置，创建新的
      await pool.query(
        `INSERT INTO shop_settings 
         (id, shop_name, logo, address, phone, email, business_hours, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [1, shop_name, logo, address, phone, email, business_hours, description]
      );
    } else {
      // 如果已有设置，更新
      await pool.query(
        `UPDATE shop_settings 
         SET shop_name = ?, logo = ?, address = ?, phone = ?, 
         email = ?, business_hours = ?, description = ?
         WHERE id = 1`,
        [shop_name, logo, address, phone, email, business_hours, description]
      );
    }
    
    // 获取更新后的设置
    const [updatedSettings] = await pool.query('SELECT * FROM shop_settings WHERE id = 1');
    
    res.json(updatedSettings[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/settings/system
 * @desc    获取系统设置
 * @access  Private
 */
router.get('/system', authenticateToken, async (req, res, next) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      throw new ApiError(403, '没有权限执行此操作');
    }
    
    // 这里可以返回系统设置信息
    // 由于没有具体的系统设置表，这里返回一些模拟数据
    res.json({
      system_name: '餐厅点餐管理系统',
      version: '1.0.0',
      max_upload_size: '5MB',
      allowed_file_types: 'jpg,jpeg,png,gif',
      backup_enabled: true,
      log_retention_days: 30,
      maintenance_mode: false
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/settings/payment
 * @desc    获取支付设置
 * @access  Private
 */
router.get('/payment', authenticateToken, async (req, res, next) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      throw new ApiError(403, '没有权限执行此操作');
    }
    
    // 这里可以返回支付设置信息
    // 由于没有具体的支付设置表，这里返回一些模拟数据
    res.json({
      payment_methods: [
        { id: 1, name: '现金支付', enabled: true },
        { id: 2, name: '微信支付', enabled: true },
        { id: 3, name: '支付宝', enabled: true },
        { id: 4, name: '银行卡', enabled: false }
      ],
      default_payment_method: 2,
      auto_confirm_payment: true,
      payment_timeout_minutes: 30
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/settings/notification
 * @desc    获取通知设置
 * @access  Private
 */
router.get('/notification', authenticateToken, async (req, res, next) => {
  try {
    // 检查权限
    if (req.user.role !== 'admin') {
      throw new ApiError(403, '没有权限执行此操作');
    }
    
    // 这里可以返回通知设置信息
    // 由于没有具体的通知设置表，这里返回一些模拟数据
    res.json({
      notification_types: [
        { id: 1, type: 'new_order', name: '新订单通知', enabled: true },
        { id: 2, type: 'order_status', name: '订单状态变更', enabled: true },
        { id: 3, type: 'payment', name: '支付通知', enabled: true },
        { id: 4, type: 'system', name: '系统通知', enabled: true }
      ],
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 