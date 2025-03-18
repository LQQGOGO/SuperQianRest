const errorHandler = (err, req, res, next) => {
  console.error('全局错误处理捕获到错误:', err);
  console.error('错误堆栈:', err.stack);
  
  // 发送错误响应
  res.status(500).json({
    status: 'error',
    message: '服务器错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler; 