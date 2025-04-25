import React, { useState, useEffect } from "react";

/* 时间格式化工具 */
const formatTime = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  const pad = (n) => String(n).padStart(2, "0");
  const map = {
    YYYY: date.getFullYear(),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => map[match]);
};

const Clock = ({
  format = "YYYY-MM-DD HH:mm:ss",
  interval = 1000,
  className = "",
  style = {},
}) => {
  const [time, setTime] = useState(formatTime(new Date(), format));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime(new Date(), format));
    }, interval);

    return () => clearInterval(timer);
  }, [format, interval]);

  return (
    <div className={className} style={style}>
      {time}
    </div>
  );
};

export default Clock;
