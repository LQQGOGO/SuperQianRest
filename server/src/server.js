const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 导入路由
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const personalRoutes = require('./routes/personalRoutes');
const settingRoutes = require('./routes/settingRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// 导入中间件
const errorHandler = require('./middleware/errorHandler');

// 在现有导入之后添加
const initDatabase = require('./utils/initDb');

const app = express();
const PORT = process.env.PORT || 3050;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/setting', settingRoutes);
app.use('/api/upload', uploadRoutes);

// 错误处理中间件
app.use(errorHandler);

// 在启动服务器之前添加
// 初始化数据库
initDatabase().catch((err) => {
  console.error('数据库初始化失败:', err);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
