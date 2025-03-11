import { createSlice } from "@reduxjs/toolkit";
import request from "@/utils/request";
import { setToken as setTokenLocal, getToken } from "@/utils/token";

const userStore = createSlice({
  name: "user",
  initialState: {
    token: getToken() || "",
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      //存入本地
      setTokenLocal(action.payload);
    },
  },
});

// 导出用户模块的actions和reducer
const { setToken } = userStore.actions;
const userReducer = userStore.reducer;

//封装异步方法
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    const res = await request.post("/auth/login", loginForm);
    dispatch(setToken(res.data.token));
  };
};

export { setToken, fetchLogin };
export default userReducer;
