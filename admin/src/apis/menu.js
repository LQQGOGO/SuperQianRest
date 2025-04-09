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

// 获取种类
export const getCategoryList = async () => {
  try {
    const res = await request.get("/category/list");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// 添加菜品
export const addMenu = async (data) => {
  try {
    const res = await request.post("/menu/add", data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
