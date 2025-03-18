const Setting = require('../models/settingModel');

// 获取店铺信息
const getShopInfo = async (req, res) => {
  try {
    const shopInfo = await Setting.getShopInfo();
    
    if (!shopInfo) {
      return res.status(404).json({ status: 'fail', message: '店铺信息未设置' });
    }
    
    res.json(shopInfo);
  } catch (error) {
    console.error('获取店铺信息错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

// 更新店铺信息
const updateShopInfo = async (req, res) => {
  try {
    const updateData = req.body;
    
    const updatedShopInfo = await Setting.updateShopInfo(updateData);
    
    res.json({
      message: '店铺信息更新成功',
      shopInfo: updatedShopInfo
    });
  } catch (error) {
    console.error('更新店铺信息错误:', error);
    res.status(500).json({ status: 'error', message: '服务器错误' });
  }
};

module.exports = {
  getShopInfo,
  updateShopInfo
}; 