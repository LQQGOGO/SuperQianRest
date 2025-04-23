import React, { useRef } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import chinaJson from "../assets/china.json";

// 注册中国地图
if (!echarts.getMap("china")) {
  echarts.registerMap("china", chinaJson);
}

const provinceData = [
  { name: "浙江", value: 62310 },
  { name: "上海", value: 59190 },
  { name: "广东", value: 55891 },
  { name: "北京", value: 51919 },
  { name: "山东", value: 39231 },
  { name: "湖北", value: 37109 },
  { name: "江苏", value: 35911 },
  { name: "四川", value: 31020 },
  { name: "江西", value: 10170 },
  { name: "重庆", value: 10010 },
  { name: "河南", value: 9700 },
  { name: "安徽", value: 9530 },
  { name: "陕西", value: 9251 },
];

// 获取前10名省份
const getTopProvinces = (data, count = 10) =>
  [...data].sort((a, b) => b.value - a.value).slice(0, count);

const ChinaMapBarChart = () => {
  const chartRef = useRef(null);
  const topProvinces = getTopProvinces(provinceData);

  const option = {
    tooltip: {
      trigger: "item",
    },
    visualMap: {
      min: 1570,
      max: 62310,
      left: "left",
      bottom: "40%",
      text: ["高", "低"],
      inRange: {
        color: ["#d0e9ff", "#0050b3"],
      },
      calculable: true,
    },
    grid: {
      left: "16%",
      bottom: "8%",
      height: "25%",
    },

    xAxis: {
      type: "category",
      data: topProvinces.map((item) => item.name),
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "地图",
        type: "map",
        map: "china",
        top: "0%",
        roam: false,
        emphasis: {
          label: { show: true },
          itemStyle: { areaColor: "#ffcc00" },
        },
        data: provinceData,
      },
      {
        name: "Top10",
        type: "bar",
        data: topProvinces.map((item) => item.value),
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: {
          color: "#0050b3",
        },
      },
    ],
  };

  // 交互逻辑：点击联动
  const onEvents = {
    click: (params) => {
      const chart = chartRef.current.getEchartsInstance();
      if (params.componentType === "series" && params.seriesType === "bar") {
        // 柱状图点击 → 地图高亮
        chart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          name: params.name,
        });
      } else if (
        params.componentType === "series" &&
        params.seriesType === "map"
      ) {
        // 地图点击 → 柱状图高亮
        chart.dispatchAction({
          type: "highlight",
          seriesIndex: 1,
          name: params.name,
        });
      }
    },
  };

  return (
    <ReactECharts
      ref={chartRef}
      option={option}
      style={{ height: "650px", width: "100%" }}
      onEvents={onEvents}
    />
  );
};

export default ChinaMapBarChart;
