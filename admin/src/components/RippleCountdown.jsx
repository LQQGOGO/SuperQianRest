import React, { useEffect, useState } from "react";
import "./RippleCountdown.scss";

const RippleCountdown = ({ seconds = 10, onEnd }) => {
  const [countdown, setCountdown] = useState(seconds);

  // 倒计时
  useEffect(() => {
    if (countdown === 0) {
      // 倒计时结束
      onEnd && onEnd();
      // 重置倒计时
      //  console.log("zi");
      setCountdown(seconds);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onEnd]);

  return (
    <span className="ele-dot is-ripple">
      <span className="ele-dot-status">
        <span className="ele-dot-ripple"></span>
      </span>
      <span className="ele-dot-text">{countdown} 秒后更新</span>
    </span>
  );
};

export default RippleCountdown;
