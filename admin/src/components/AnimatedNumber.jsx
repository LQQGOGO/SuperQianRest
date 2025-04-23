import React, { useEffect, useState } from "react";

const AnimatedNumber = ({
  from = 0,
  to = 1000,
  duration = 1000,
}) => {
  const [displayNumber, setDisplayNumber] = useState(from);

  useEffect(() => {
    const startTime = performance.now();

    // now是浏览器requestAnimationFrame传进来的当前时间
    const animate = (now) => {

        // 已经过去的时间
      const elapsed = now - startTime;

      // 表示动画的完成进度，限制最大值为1，以免超过目标值
      const progress = Math.min(elapsed / duration, 1);

      // 计算当前的数字
      const current = Math.floor(from + (to - from) * progress);

      setDisplayNumber(current);

      //   进度未达到的时候递归调用
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [from, to, duration]);

  return (
    <div>
      {displayNumber.toLocaleString()}
    </div>
  );
};

export default AnimatedNumber;
