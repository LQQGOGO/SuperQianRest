import request from "@/utils/request";

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

