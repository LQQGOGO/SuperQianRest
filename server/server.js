const app = require("./app");
const logger = require("./utils/logger");
const appConfig = require("./config/app");

const PORT = appConfig.port;
const HOST = appConfig.host || "localhost";

// 启动服务器
app.listen(PORT, () => {
  logger.info(`服务器运行在端口 ${PORT}, 环境: ${appConfig.env}`);
  logger.info(`API文档地址: http://${HOST}:${PORT}/api-docs`);
  logger.info(`服务器访问地址: http://${HOST}:${PORT}`);

  // 控制台输出彩色提示
  console.log("\x1b[36m%s\x1b[0m", `服务器已启动! 🚀`);
  console.log("\x1b[32m%s\x1b[0m", `- 本地访问: http://${HOST}:${PORT}`);
  console.log(
    "\x1b[32m%s\x1b[0m",
    `- API文档: http://${HOST}:${PORT}/api-docs`
  );
  console.log("\x1b[33m%s\x1b[0m", `- 环境: ${appConfig.env}`);
});

// 处理未捕获的异常
process.on("uncaughtException", (err) => {
  logger.error("未捕获的异常:", err);
  process.exit(1);
});

// 处理未处理的Promise拒绝
process.on("unhandledRejection", (reason, promise) => {
  logger.error("未处理的Promise拒绝:", reason);
});
