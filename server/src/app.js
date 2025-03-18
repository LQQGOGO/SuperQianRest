const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');

// 初始化应用
const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api', routes);

// 处理未找到的路由
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `找不到路径: ${req.originalUrl}`,
  });
});

// 全局错误处理中间件
app.use(errorMiddleware);

module.exports = app;
