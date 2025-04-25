import { Card } from "antd";
import { useState} from "react";
import "./Monitor.scss";
import ChinaMap from "@/components/ChinaMap";
import Clock from "@/components/Clock";
import AnimatedNumber from "@/components/AnimatedNumber";
import RippleCountdown from "@/components/RippleCountdown";

const Monitor = () => {
  const [from, setFrom] = useState(684);
  const [to, setTo] = useState(1742);
  const [countdown, setCountdown] = useState(10);

  const handleCountdownEnd = () => {
    const newTo = to + 1121;
    setFrom(to); // 当前数字作为起点
    setTo(newTo); // 设置新目标值
    setCountdown(10); // 重新开始倒计时
  };

  return (
    <div className="monitor-container">
      {/* 总访问人数 */}
      <Card className="monitor-card">
        <div className="monitor-card-content">
          <span
            className="monitor-card-icon"
            style={{ backgroundColor: "#eaeefd", border: "1px solid #2f54eb" }}
          >
            <i>
              <svg
                t="1744876608064"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5277"
                width="20"
                height="20"
              >
                <path
                  d="M469.333333 554.666667c119.466667 0 213.333333-93.866667 213.333334-213.333334s-93.866667-213.333333-213.333334-213.333333-213.333333 93.866667-213.333333 213.333333 93.866667 213.333333 213.333333 213.333334z m0-341.333334c72.533333 0 128 55.466667 128 128s-55.466667 128-128 128-128-55.466667-128-128 55.466667-128 128-128zM277.333333 682.666667h243.2c8.533333-29.866667 25.6-59.733333 46.933334-85.333334H277.333333C196.266667 597.333333 128 665.6 128 746.666667S196.266667 896 277.333333 896h290.133334c-21.333333-25.6-34.133333-55.466667-46.933334-85.333333H277.333333c-34.133333 0-64-29.866667-64-64S243.2 682.666667 277.333333 682.666667zM853.333333 661.333333l-85.333333-51.2c-12.8-8.533333-29.866667-8.533333-42.666667 0l-85.333333 51.2c-12.8 8.533333-21.333333 21.333333-21.333333 38.4v98.133334c0 17.066667 8.533333 29.866667 21.333333 38.4l85.333333 51.2c12.8 8.533333 29.866667 8.533333 42.666667 0l85.333333-51.2c12.8-8.533333 21.333333-21.333333 21.333334-38.4v-98.133334c0-17.066667-8.533333-34.133333-21.333334-38.4z m-64 110.933334l-42.666666 25.6-42.666667-25.6v-51.2l42.666667-25.6 42.666666 25.6v51.2z"
                  fill="#2f54eb"
                  p-id="5278"
                ></path>
              </svg>
            </i>
          </span>
          <span className="monitor-card-content">21.2k</span>
          <span className="monitor-card-title">总访问人数</span>
        </div>
      </Card>

      {/* 点击量 */}
      <Card className="monitor-card">
        <div className="monitor-card-content">
          <span
            className="monitor-card-icon"
            style={{ backgroundColor: "#fff7e8", border: "1px solid #feefd2" }}
          >
            <i>
              <svg
                t="1745328385918"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3049"
                width="20"
                height="20"
              >
                <path
                  d="M512.051944 0.000347a364.040555 364.040555 0 0 0-364.474452 362.860352c0 84.072107 45.941137 166.616893 90.389664 246.454153a859.326624 859.326624 0 0 1 61.405267 124.684975c12.895453 35.961479 22.823043 69.215434 31.587786 98.581662C362.999249 939.493995 388.165342 1024 512.051944 1024s149.087407-84.245666 181.022312-190.91519c8.677963-29.244736 18.674977-62.377199 31.622498-98.390746a873.975026 873.975026 0 0 1 61.214352-124.459347c44.500595-80.201736 90.511156-163.145707 90.511155-247.356662A364.040555 364.040555 0 0 0 512.051944 0.000347z m0 954.454456c-35.996191 0-56.528252-8.851522-72.686619-32.97626h145.49473c-16.175723 24.142094-36.72514 32.993616-72.808111 32.993616z m96.446883-85.044039H415.743909a928.507346 928.507346 0 0 1-5.762167-17.355926h204.296608c-1.978576 6.109286-3.887727 11.854098-5.779523 17.33857z m21.451925-68.6774a26.172737 26.172737 0 0 0-6.213422-0.833085H394.101069c-3.349694-11.142505-6.820879-22.562704-10.639183-34.711852H640.867629c-3.939795 12.35742-7.49776 24.124738-10.916877 35.527581z m94.867493-224.082365a1081.170074 1081.170074 0 0 0-59.565539 118.992231H359.198301a1057.11476 1057.11476 0 0 0-60.103573-120.050942c-40.126902-72.079162-81.572854-146.60551-81.572853-212.696877a294.582137 294.582137 0 0 1 589.146919 0c-0.052068 66.264927-41.619511 141.225172-81.850549 213.738232zM500.371406 142.839621A215.66474 215.66474 0 0 0 284.51575 357.792768a34.902768 34.902768 0 0 0 69.805536 0 145.911273 145.911273 0 0 1 146.05012-145.442662 34.76392 34.76392 0 1 0 0-69.527841z"
                  fill="#faad14"
                  p-id="3050"
                ></path>
              </svg>
            </i>
          </span>
          <span className="monitor-card-content">1.6k</span>
          <span className="monitor-card-title">点击量</span>
        </div>
      </Card>

      {/* 转化率 */}
      <Card className="monitor-card">
        <div className="monitor-card-content">
          <span
            className="monitor-card-icon"
            style={{ backgroundColor: "#eef9e8", border: "1px solid #d2efc3" }}
          >
            <i>
              <svg
                t="1745328719513"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5868"
                width="20"
                height="20"
              >
                <path
                  d="M908.9 533.973l-170.738-0.284c-9.202 2.531-18.674-2.973-21.12-12.189l-25.757-95.644-80.654 364.757s-1.621 33.721-12.416 33.721-29.013 0.299-29.013 0.299c-8.903 2.432-18.034-2.901-20.41-11.819L448.755 319.132 372.92 662.06c-2.475 22.713-12.942 30.137-22.016 27.79l-26.837 0.341c-9.43 2.503-19.058-2.986-21.632-12.245l-50.589-143.972H115.228c-9.543 0-17.265-7.722-17.265-17.28v-20.721c0-9.558 7.765-17.224 17.265-17.224l169.8-0.597c10.325-0.299 19.072 0.896 21.589 10.07l26.311 82.076 74.098-387.129s3.67-11.733 15.516-11.733c11.819 0 36.765-0.512 36.765-0.512 8.917-2.39 18.076 2.901 20.437 11.818l99.172 489.885 73.287-351.858c2.417-8.96 9.372-16.384 18.332-13.995l29.426-0.384c9.202-2.474 18.674 3.015 21.148 12.203l50.333 160.114h137.386c9.515 0 17.238 7.708 17.238 17.223v20.707c0.07 9.615-7.694 17.337-17.166 17.337z m0 0"
                  p-id="5869"
                  fill="#52c41a"
                ></path>
              </svg>
            </i>
          </span>
          <span className="monitor-card-content">28.8%</span>
          <span className="monitor-card-title">转化率</span>
        </div>
      </Card>

      {/* 用户分布 */}
      <Card className="monitor-card" title="用户分布">
        <div className="monitor-card-content">
          <ChinaMap />
        </div>
      </Card>

      {/* 在线人数 */}
      <Card className="monitor-card" title="在线人数">
        <div className="monitor-card-content">
          <div className="monitor-card-content-item time">
            <Clock format="HH:mm:ss" />
          </div>
          <div className="monitor-card-content-item animated-number">
            <AnimatedNumber from={from} to={to} duration={2000} />
          </div>
          <div className="monitor-card-content-item">
            <span className="monitor-card-title">当前在线人数</span>
          </div>
          <div className="monitor-card-content-item">
            <RippleCountdown seconds={countdown} onEnd={handleCountdownEnd} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Monitor;
