import { getSalesData } from "@/apis/report";
import { useEffect, useState } from "react";
import { Card, Statistic, Row, Col } from "antd";
import "./SalesData.scss";
import WordCloud from "@/components/WordCloud";

const SalesData = () => {
  const [salesData, setSalesData] = useState({});
  const [hotDishes, setHotDishes] = useState([]);

  // 获取销售数据
  const fetchSalesData = async () => {
    const res = await getSalesData();
    console.log(res);

    // 获取热门菜品
    const topDishes = res.topItems.map((item) => ({
      name: item.menu_item_name,
      value: item.total_quantity,
    }));

    setSalesData(res);
    setHotDishes(topDishes);
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <div className="sales-data">
      {/*总统计数据 */}
      <Card>
        {salesData.totals && (
          <>
            <Statistic
              title="总销售额"
              value={`￥${salesData.totals.total_sales}`}
              valueStyle={{ color: "#3f8600", fontSize: 28 }}
            />
            <Statistic title="总订单数" value={salesData.totals.total_orders} />
            <Statistic
              title="平均订单金额"
              precision={2}
              value={salesData.totals.average_order_value}
            />
          </>
        )}
      </Card>

      {/* 热门菜品 */}
      <Card title="热门菜品">
        <WordCloud data={hotDishes} />
      </Card>
    </div>
  );
};

export default SalesData;
