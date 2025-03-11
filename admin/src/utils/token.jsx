// 封装token的存取方法

const tokenKey = "6627";

// 获取token
export const getToken = () => {
  return localStorage.getItem(tokenKey);
};

// 设置token
export const setToken = (token) => {
  localStorage.setItem(tokenKey, token);
};

// 删除token
export const removeToken = () => {
  localStorage.removeItem(tokenKey);
};
