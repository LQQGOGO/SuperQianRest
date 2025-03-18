const db = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const initDatabase = async () => {
  try {
    console.log('开始初始化数据库...');
    
    // 检查是否已有管理员用户
    const [adminRows] = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
    );
    
    if (adminRows[0].count === 0) {
      console.log('创建默认管理员账户...');
      
      // 创建默认管理员
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.DB_PASSWORD || 'admin123', salt);
      
      await db.query(
        `INSERT INTO users (username, password, name, role, status) 
         VALUES (?, ?, ?, ?, ?)`,
        ['admin', hashedPassword, '系统管理员', 'admin', 1]
      );
      
      console.log('默认管理员账户创建成功');
    } else {
      console.log('管理员账户已存在，跳过创建');
    }
    
    // 检查是否已有店铺设置
    const [shopRows] = await db.query(
      "SELECT COUNT(*) as count FROM shop_settings"
    );
    
    if (shopRows[0].count === 0) {
      console.log('创建默认店铺设置...');
      
      // 创建默认店铺设置
      await db.query(
        `INSERT INTO shop_settings (shop_name, address, phone, business_hours, description) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          '美味佳肴餐厅',
          '北京市海淀区中关村大街100号',
          '010-12345678',
          '周一至周日 10:00-22:00',
          '提供正宗中华美食，让您品尝舌尖上的中国。我们坚持使用新鲜食材，注重菜品品质，为顾客提供最佳用餐体验。'
        ]
      );
      
      console.log('默认店铺设置创建成功');
    } else {
      console.log('店铺设置已存在，跳过创建');
    }
    
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
};

// 如果直接运行此脚本，则执行初始化
if (require.main === module) {
  initDatabase().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = initDatabase; 