const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { auth } = require('../middleware/auth');

// 上传图片
router.post('/image', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: '没有上传文件' });
    }
    
    // 返回文件路径
    const filePath = `/uploads/images/${req.file.filename}`;
    
    res.json({
      message: '文件上传成功',
      filePath
    });
  } catch (error) {
    console.error('文件上传错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
});

// 上传文件
router.post('/file', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: '没有上传文件' });
    }
    
    // 返回文件路径
    const filePath = `/uploads/files/${req.file.filename}`;
    
    res.json({
      message: '文件上传成功',
      filePath
    });
  } catch (error) {
    console.error('文件上传错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
});

module.exports = router; 