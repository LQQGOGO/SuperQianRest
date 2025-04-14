import request from "@/utils/request";
import { message } from "antd";

// 获取订单列表
export const getOrderList = async (params) => {
  try {
    const res = await request.get("/order/list", { params });
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message || "获取订单列表失败");
    } else {
      message.error("获取订单列表失败");
    }
    throw error;
  }
};

// 获取订单详情
export const getOrderDetail = async (id) => {
  try {
    const res = await request.get(`/order/detail/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message || "获取订单详情失败");
    } else {
      message.error("获取订单详情失败");
    }
    throw error;
  }
};


