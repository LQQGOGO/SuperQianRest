const { login, getUserInfo } = require('../../controllers/authController');
const { pool } = require('../../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 模拟依赖
jest.mock('../../models/db');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      body: {
        username: 'admin',
        password: '123456'
      },
      user: {
        id: 1
      }
    };
    
    res = {
      json: jest.fn()
    };
    
    next = jest.fn();
  });
  
  describe('login', () => {
    test('应该成功登录并返回token', async () => {
      // 模拟数据库查询结果
      pool.query.mockResolvedValueOnce([
        [{
          id: 1,
          username: 'admin',
          password: 'hashedPassword',
          role: 'admin'
        }]
      ]);
      
      // 模拟密码比较结果
      bcrypt.compare.mockResolvedValueOnce(true);
      
      // 模拟JWT生成
      jwt.sign.mockReturnValueOnce('fake-token');
      
      await login(req, res, next);
      
      expect(pool.query).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        token: 'fake-token',
        adminInfo: {
          id: 1,
          username: 'admin',
          role: 'admin'
        }
      });
    });
  });
}); 