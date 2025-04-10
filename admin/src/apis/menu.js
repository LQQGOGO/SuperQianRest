import request from "@/utils/request";
import { message } from "antd";
// 获取菜单列表
export const getMenuList = async () => {
  try {
    const res = await request.get("/menu/list", {
      params: {
        limit: 100,
      },
    });
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
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message || "创建菜品失败");
    } else {
      message.error("创建菜品失败");
    }
    throw error;
  }
};

// 编辑菜品
export const editMenu = async (id, data) => {
  try {
    const res = await request.put(`/menu/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message || "编辑菜品失败");
    } else {
      message.error("编辑菜品失败");
    }
    throw error;
  }
};

// 删除菜品
export const deleteMenu = async (id) => {
  try {
    const res = await request.delete(`/menu/delete/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message || "删除菜品失败");
    } else {
      message.error("删除菜品失败");
    }
    throw error;
  }
};

// 获取种类
export const getCategoryList = async () => {
  try {
    const res = await request.get("/category/list");
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message || "获取种类失败");
    } else {
      message.error("获取种类失败");
    }
    throw error;
  }
};

// 添加种类
export const addCategory = async (data) => {
  try {
    const res = await request.post("/category/add", data);
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 400) {
      message.error(error.response.data.message || "添加种类失败");
    } else {
      message.error("添加种类失败");
    }
    throw error;
  }
};
