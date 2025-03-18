require('dotenv').config();
const app = require('./app');
const { pool } = require('./config/database');

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常! 💥 关闭服务器...');
  console.error(err.name, err.message);
  process.exit(1);
});

// 测试 MySQL 连接
pool
  .query('SELECT 1')
  .then(() => console.log('MySQL 连接成功'))
  .catch((err) => console.error('MySQL 连接失败:', err));

// 启动服务器
const port = process.env.PORT || 3050;
const server = app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
});

// 处理未处理的 Promise 拒绝
process.on('unhandledRejection', (err) => {
  console.error('未处理的 Promise 拒绝! 💥 关闭服务器...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
