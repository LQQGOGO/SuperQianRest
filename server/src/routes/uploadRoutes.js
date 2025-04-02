const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { auth } = require('../middleware/auth');
require('dotenv').config();

// 获取服务器基础URL
const getBaseUrl = (req) => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

// 上传图片
router.post('/image', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: '没有上传文件' });
    }

    // 返回文件路径
    const relativePath = `/uploads/images/${req.file.filename}`;
    const baseUrl = getBaseUrl(req);
    const fullUrl = `${baseUrl}${relativePath}`;

    res.json({
      message: '文件上传成功',
      filePath: relativePath,
      fileUrl: fullUrl,
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
    const relativePath = `/uploads/files/${req.file.filename}`;
    const baseUrl = getBaseUrl(req);
    const fullUrl = `${baseUrl}${relativePath}`;

    res.json({
      message: '文件上传成功',
      filePath: relativePath,
      fileUrl: fullUrl,
    });
  } catch (error) {
    console.error('文件上传错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
});

module.exports = router;
