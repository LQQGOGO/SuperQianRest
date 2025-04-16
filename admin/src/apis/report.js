import request from "@/utils/request";
import { message } from "antd";

// 获取销售数据
export const getSalesData = async (startDate, endDate) => {
  try {
    if (!startDate || !endDate) {
      startDate = "2022-01-01";
      endDate = new Date().toISOString().split("T")[0];
    }
    const res = await request.get("/report/sales", {
      params: {
        startDate,
        endDate,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    message.error("获取销售数据失败");
    throw error;
  }
};
