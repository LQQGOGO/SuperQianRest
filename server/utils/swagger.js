const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "点餐系统API文档",
      version: "1.0.0",
      description: "点餐系统后端API接口文档",
    },
    servers: [
      {
        url: "http://localhost:3050",
        description: "开发服务器",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
};
