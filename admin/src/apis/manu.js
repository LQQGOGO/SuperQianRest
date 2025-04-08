import request from "@/utils/request";

// 获取菜单列表
export const getMenuList = async () => {
  try {
    const res = await request.get("/menu/list");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
