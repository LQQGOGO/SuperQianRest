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

// 更新订单状态
export const updateOrderStatus = async (id, status) => {
  try {
    const res = await request.put(`/order/update/${id}`, { status });
    message.success("更新订单状态成功");
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message || "更新订单状态失败");
    } else {
      message.error("更新订单状态失败");
    }
    throw error;
  }
};

// 删除订单
export const deleteOrder = async (id) => {
  try {
    const res = await request.delete(`/order/delete/${id}`);
    message.success("删除订单成功");
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message || "删除订单失败");
    } else {
      message.error("删除订单失败");
    }
    throw error;
  }
};

// 获取订单统计数据
export const getOrderStats = async () => {
  try {
    const res = await request.get("/order/stats");
    return res.data;
  } catch (error) {
    console.log(error);
    message.error("获取订单统计数据失败");
    throw error;
  }
};
