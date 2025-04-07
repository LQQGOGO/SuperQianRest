import request from "@/utils/request";
import { message } from "antd";

export const uploadImage = async (file) => {
  // 创建 FormData 对象
  const formData = new FormData();
  formData.append("image", file);

  try {
    // 发送请求
    const response = await request.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    });
    

    // 检查响应
    if (response.status === 200 && response.data.fileUrl) {
      return response.data.fileUrl;
    } else {
      message.error(response.data.message || "上传失败");
      return Promise.reject(new Error(response.data.message || "上传失败"));
    }
  } catch (error) {
    // 处理错误
    const errorMsg = error.response?.data?.message || "图片上传失败，请重试";
    message.error(errorMsg);
    return Promise.reject(error);
  }
};
