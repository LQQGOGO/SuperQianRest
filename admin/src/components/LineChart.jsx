import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const LineChart = ({ data, title }) => {
  // 绑定div
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      // 鼠标停留提示框
      tooltip: {
        trigger: "axis",
        formatter: `{b}<br />${title}: {c}`,
      },
      // x轴
      xAxis: {
        type: "category",
        // 折线从 y 轴起点开始绘制。
        boundaryGap: false,
        data: data.map((item) => item.date),
        // 去掉轴线和刻度线，界面更清爽。
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#999" },
      },
      // y轴
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#eee",
          },
        },
        axisLabel: { color: "#999" },
      },
      // 网格
      grid: {
        left: "0%",
        right: "0%",
        bottom: "0%",
        top: "10%",
        containLabel: true,
      },
      // 系列
      series: [
        {
          name: "访问量",
          type: "line",
          smooth: true, // 平滑曲线
          symbol: "none", // 不显示拐点
          lineStyle: {
            color: "#8a2be2",
            width: 2,
          },
          areaStyle: {
            color: "rgba(138, 43, 226, 0.2)", // 紫色区域填充
          },
          data: data.map((item) => item.value),
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
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "200px" }} />;
};

export default LineChart;
