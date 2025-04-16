import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import dayjs from "dayjs";
import { Button } from "antd";

const ToggleSalesChart = ({ dailySales }) => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState("sales"); // 'sales' or 'orders'

  // 初始化或更新图表
  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const dates = dailySales.map((item) => dayjs(item.date).format("MM-DD"));
    const values =
      chartType === "sales"
        ? dailySales.map((item) => parseFloat(item.total_sales))
        : dailySales.map((item) => item.order_count);

    const option = {
      tooltip: {
        trigger: "axis",
      },
      title: {
        text: chartType === "sales" ? "销售额趋势" : "订单数趋势",
        left: "center",
        top: 10,
        textStyle: {
          fontSize: 16,
        },
      },
      xAxis: {
        type: "category",
        data: dates,
      },
      yAxis: {
        type: "value",
        name: chartType === "sales" ? "金额（元）" : "订单数",
      },
      series: [
        {
          data: values,
          type: "line",
          smooth: true,
          areaStyle: {
            color: chartType === "sales" ? "#d3adf7" : "#91d5ff",
          },
          lineStyle: {
            color: chartType === "sales" ? "#9254de" : "#1890ff",
          },
        },
      ],
    };

    chart.setOption(option);

    // 响应式
    window.addEventListener("resize", chart.resize);
    return () => {
      window.removeEventListener("resize", chart.resize);
      chart.dispose();
    };
  }, [dailySales, chartType]);

  return (
    <div>
      <div style={{ textAlign: "right", marginBottom: 8 }}>
        <Button
          type={chartType === "sales" ? "primary" : "default"}
          onClick={() => setChartType("sales")}
          style={{ marginRight: 8 }}
        >
          销售额
        </Button>
        <Button
          type={chartType === "orders" ? "primary" : "default"}
          onClick={() => setChartType("orders")}
        >
          订单数
        </Button>
      </div>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
};

export default ToggleSalesChart;
