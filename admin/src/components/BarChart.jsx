import React from "react";
import ReactECharts from "echarts-for-react";

const BarChart = ({
  title = "柱状图",
  xData = [],
  yData = [],
  color = "#5470C6",
}) => {
  const option = {
    title: {
      text: title,
      left: "center",
      textStyle: {
        fontSize: 18,
      },
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: xData,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: yData,
        type: "bar",
        itemStyle: {
          color,
        },
        barWidth: "60%",
      },
    ],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
  };

  return (
    <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
  );
};

export default BarChart;
