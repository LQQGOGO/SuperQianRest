import request from "@/utils/request";
import { message } from "antd";
// 获取用户列表
export const getUserList = async () => {
  try {
    const res = await request.get("/user/list");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 创建用户
export const createUser = async (data) => {
  try {
    const res = await request.post("/user/add", data);
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message || "创建用户失败");
    } else {
      message.error("创建用户失败");
    }
    throw error;
  }
};

// 编辑用户
export const editUser = async (id, data) => {
  try {
    const res = await request.put(`/user/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message || "编辑用户失败");
    } else {
      message.error("编辑用户失败");
    }
    throw error;
  }
};
