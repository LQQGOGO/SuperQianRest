import request from "../utils/request";
import { message } from "antd";

// 获取店铺信息
export const getShopInfo = async () => {
  try {
    const res = await request.get("/setting/shop-info");
    return res.data;
  } catch (error) {
    console.log(error);
    message.error("获取店铺信息失败");
    throw error;
  }
};
