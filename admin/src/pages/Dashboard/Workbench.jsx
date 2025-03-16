import { Card, Avatar, Space } from "antd";
import avatar from "@/assets/logo.png";
import Icon from "@ant-design/icons";
import RainOutlineSvg from "@/assets/Icons/Rain_Outline.svg?react";
import "./Workbench.scss";

const Workbench = () => {
  return (
    <div className="workbench-container">
      <Card style={{ width: "100%" }} className="user">
        <Space size={30} align="center">
          <Avatar src={avatar} size={60} />
          <span className="user-text">
            <p style={{ fontSize: 20, fontWeight: 400 }}>
              你好管理员，请开始你今天的工作吧
            </p>
            <p style={{ fontSize: 15, fontWeight: 300, color: "#999" }}>
              <Icon
                component={RainOutlineSvg}
                style={{ height: 15, width: 15 }}
              />
              今天的天气有点糟糕，记得多穿衣服哦~
            </p>
          </span>
        </Space>
        <div className="user-works">
          <Space size={30}>
            <div className="user-works-item">
              <p>项目数</p>
              <p>10</p>
            </div>
            <div className="user-works-item">
              <p>待办项</p>
              <p>10</p>
            </div>
            <div className="user-works-item">
              <p>今日消息</p>
              <p>10</p>
            </div>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Workbench;
