import { getSalesData } from "@/apis/report";
import { useEffect, useState } from "react";
import { Card, Statistic, Tabs } from "antd";
import "./SalesData.scss";
import WordCloud from "@/components/WordCloud";
import LineChart from "@/components/LineChart";
import BarChart from "@/components/BarChart";
import dayjs from "dayjs";

const SalesData = () => {
  const [salesData, setSalesData] = useState({});
  const [hotDishes, setHotDishes] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [orderTrend, setOrderTrend] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [categoryOrders, setCategoryOrders] = useState([]);
  const [categorySales, setCategorySales] = useState([]);

  // 获取销售数据
  const fetchSalesData = async () => {
    const res = await getSalesData();

    // 获取热门菜品
    const topDishes = res.topItems.map((item) => ({
      name: item.menu_item_name,
      value: item.total_quantity,
    }));

    // 获取销售额趋势
    const salesTrend = res.dailySales.map((item) => ({
      date: dayjs(item.date).format("MM-DD"),
      value: item.total_sales,
    }));

    // 获取订单趋势
    const orderTrend = res.dailySales.map((item) => ({
      date: dayjs(item.date).format("MM-DD"),
      value: item.order_count,
    }));

    // 获取分类销量统计
    const categoryNames = res.categorySales.map((item) => item.category_name);
    const categoryOrders = res.categorySales.map((item) => item.order_count);
    const categorySales = res.categorySales.map((item) => item.total_sales);

    setCategoryNames(categoryNames);
    setCategoryOrders(categoryOrders);
    setCategorySales(categorySales);

    setSalesData(res);
    setHotDishes(topDishes);
    setSalesTrend(salesTrend);
    setOrderTrend(orderTrend);
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

      {/* 销售额趋势图 */}
      <Card>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "销售额",
              children: <LineChart data={salesTrend} title="销售额" />,
            },
            {
              key: "2",
              label: "订单量",
              children: <LineChart data={orderTrend} title="订单量" />,
            },
          ]}
        />
      </Card>

      {/* 分类销量统计 */}
      <Card>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "销售额",
              children: (
                <BarChart
                  title="分类销售额统计"
                  xData={categoryNames}
                  yData={categorySales}
                  color="#91cc75"
                />
              ),
            },
            {
              key: "2",
              label: "订单量",
              children: (
                <BarChart
                  title="分类订单量统计"
                  xData={categoryNames}
                  yData={categoryOrders}
                  color="#91cc75"
                />
              ),
            },
          ]}
        />
      </Card>

      {/* 热门菜品 */}
      <Card title="热门菜品">
        <WordCloud data={hotDishes} />
      </Card>
    </div>
  );
};

export default SalesData;
