const express = require('express');
const cors = require('cors');
const path = require('path');
//加载环境变量
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

// 导入错误处理中间件
const errorHandler = require('./middleware/errorHandler');

// 初始化数据库
// const initDatabase = require('./utils/initDb');

const app = express();
const PORT = process.env.PORT || 3050;

// 配置cors解决跨域
app.use(cors({
  origin: '*', // 允许所有来源
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 暴露静态资源目录
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 在所有路由之前添加
// 显示api调用信息
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// app.get('/api/test', (req, res) => {
//   console.log('收到测试请求');
//   res.json({ message: '服务器正常运行' });
// });

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
// initDatabase().catch((err) => {
//   console.error('数据库初始化失败:', err);
// });

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
