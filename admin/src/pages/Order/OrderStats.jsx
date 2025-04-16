import { Card, Statistic } from "antd";
import { getOrderStats } from "@/apis/order";
import { useEffect, useState } from "react";

const OrderStats = () => {
  const [orderStats, setOrderStats] = useState({});

  // 获取订单统计数据
  const fetchOrderStats = async () => {
    const res = await getOrderStats();
    console.log(res);
    setOrderStats(res);
  };

  useEffect(() => {
    fetchOrderStats();
  }, []);

  return (
    <Card>
      <Statistic title="总销售额" value={`￥${orderStats.totalSales}`} />
      <Statistic title="总订单数" value={orderStats.totalOrders} />
      {orderStats.statusCounts && (
        <Statistic
          title="订单详情"
          value={`已取消:${orderStats.statusCounts.cancelled} 制作中:${orderStats.statusCounts.processing} 已完成:${orderStats.statusCounts.completed}`}
        />
      )}
    </Card>
  );
};

export default OrderStats;
