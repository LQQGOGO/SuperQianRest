import request from "../utils/request"
import { message } from "antd";

// 获取个人信息数据
export const getPersonalProfile = async () => {
  try {
    const res = await request.get("/personal/profile");
    return res.data;
  } catch (error) {
    console.log(error);
    message.error("获取个人信息数据失败");
    throw error;
  }
};

// 更新个人信息
export const updatePersonalProfile = async (data) => {
  try {
    const res = await request.put("/personal/profile", data);
    return res.data;
  } catch (error) {
    console.log(error);
    message.error("更新个人信息失败");
    throw error;
  }
};
