const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  secret: process.env.JWT_SECRET || '677gogo',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
}; 