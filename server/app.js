const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { errorHandler } = require("./middlewares/errorHandler");
const logger = require("./utils/logger");
const appConfig = require("./config/app");
const swagger = require("./utils/swagger");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "677gogo";

// 数据库连接池
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "order_admin",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 中间件
app.use(helmet());
app.use(cors(appConfig.corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

// 导入路由
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const reportRoutes = require("./routes/reports");
const settingRoutes = require("./routes/settings");
const dashboardRoutes = require("./routes/dashboardRoutes");
const personalRoutes = require("./routes/personal");

// 注册路由
app.use("/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/personal", personalRoutes);

// API文档
app.use("/api-docs", swagger.serve, swagger.setup);

// 404处理
app.use((req, res, next) => {
  res.status(404).json({ message: "请求的资源不存在" });
});

// 错误处理中间件
app.use(errorHandler);

module.exports = app;
