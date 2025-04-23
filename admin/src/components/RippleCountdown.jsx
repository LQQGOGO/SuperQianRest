import React, { useEffect, useState } from "react";
import "./RippleCountdown.scss";

const RippleCountdown = ({ seconds = 10, onEnd }) => {
  const [countdown, setCountdown] = useState(seconds);

  useEffect(() => {
    if (countdown === 0) {
      onEnd && onEnd();
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
