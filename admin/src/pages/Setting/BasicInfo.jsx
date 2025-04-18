import { getShopInfo } from "../../apis/setting"; 
import { useState, useEffect } from "react";
import { Card,Avatar } from "antd";

const BasicInfo = () => {
  const [shopInfo, setShopInfo] = useState(null);


  // 获取店铺信息
  const fetchShopInfo = async () => {
    const res = await getShopInfo();
    console.log(res);
    setShopInfo(res);
  };

  useEffect(() => {
    fetchShopInfo();
  }, []);

  return (
    <div className="basic-info-container">
      {shopInfo && <Card title="店铺信息">
        <Avatar src={shopInfo.logo} size={100} />
        <div className="shop-info-content">
            <div className="shop-info-item">
              <span className="shop-info-label">店铺名称：</span>
              <span className="shop-info-value">{shopInfo.shop_name}</span>
            </div>
            <div className="shop-info-item">
              <span className="shop-info-label">店铺地址：</span>
              <span className="shop-info-value">{shopInfo.address}</span>
            </div>
            <div className="shop-info-item">
              <span className="shop-info-label">店铺电话：</span>
              <span className="shop-info-value">{shopInfo.phone}</span>
            </div>
            <div className="shop-info-item">
              <span className="shop-info-label">店铺邮箱：</span>
              <span className="shop-info-value">{shopInfo.email}</span>
            </div>
        </div>
      </Card>}
    </div>
  );
};

export default BasicInfo; 