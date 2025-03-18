const mysql = require('mysql2/promise');
const dbConfig = require('../config/db');
const logger = require('../utils/logger');

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    logger.error('数据库连接失败:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection
}; 