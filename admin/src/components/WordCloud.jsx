import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "echarts-wordcloud"; // 一定要引入词云插件

const WordCloud = ({ data }) => {
    // 绑定div，将图表挂载在div上
  const chartRef = useRef(null);

  useEffect(() => {
    // 组件加载的时候，创建Echarts图片实例
    const chart = echarts.init(chartRef.current);

    // 词云配置项
    const option = {
      tooltip: {
        show: true,
      },
      series: [
        {
          type: "wordCloud",
          shape: "circle", // circle | diamond | triangle | star
          left: "center",
          top: "center",
          width: "100%",
          height: "100%",
          sizeRange: [12, 40], // 字体大小范围
          rotationRange: [-90, 90], // 旋转角度范围
          rotationStep: 45, // 旋转角度步长
          gridSize: 8, // 字体间距
          drawOutOfBound: true, // 是否超出边界
          textStyle: {
            fontFamily: "微软雅黑",
            fontWeight: "bold",
            // 随机颜色
            color: () => {
              const r = Math.round(Math.random() * 160);
              const g = Math.round(Math.random() * 160);
              const b = Math.round(Math.random() * 160);
              return `rgb(${r},${g},${b})`;
            },
          },
          data: data, // 接收外部传入的数据
        },
      ],
    };

    chart.setOption(option);

    // 响应式处理
    window.addEventListener("resize", chart.resize);

    // 组件卸载的时候，销毁Echarts实例
    return () => {
      window.removeEventListener("resize", chart.resize);
      chart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default WordCloud;
