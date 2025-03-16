import { Card, Avatar, Space, Col, Row } from "antd";
import avatar from "@/assets/logo.png";
import Icon from "@ant-design/icons";
import RainOutlineSvg from "@/assets/Icons/RainOutline.svg?react";
import ProjectMapSvg from "@/assets/Icons/ProjectMap.svg?react";
import TodoSvg from "@/assets/Icons/Todo.svg?react";
import MessageSvg from "@/assets/Icons/Message.svg?react";
import "./Workbench.scss";

const Workbench = () => {
  return (
    <div className="workbench-container">
      {/* 工作台顶部用户信息 */}
      <Card
        style={{ width: "100%", borderRadius: 20, marginBottom: 20 }}
        className="user"
      >
        {/* 用户信息 */}
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
        {/* 工作统计 */}
        <div className="user-works">
          <Space size={30}>
            <div className="user-works-item">
              <p
                style={{
                  backgroundColor: "#eaeefd",
                }}
              >
                <Icon
                  component={ProjectMapSvg}
                  style={{ height: 15, width: 15, color: "#2f54eb" }}
                />{" "}
                &nbsp;项目数
              </p>
              <p style={{ fontSize: 20, fontWeight: 600 }}>10</p>
            </div>
            <div className="user-works-item">
              <p
                style={{
                  backgroundColor: "#fff7e12",
                }}
              >
                <Icon
                  component={TodoSvg}
                  style={{ height: 15, width: 15, color: "#faad14" }}
                />{" "}
                &nbsp;待办事项
              </p>
              <p style={{ fontSize: 20, fontWeight: 600 }}>10</p>
            </div>
            <div className="user-works-item">
              <p
                style={{
                  backgroundColor: "#eef9e8",
                }}
              >
                <Icon
                  component={MessageSvg}
                  style={{ height: 15, width: 15, color: "#52c41a" }}
                />{" "}
                &nbsp;今日消息
              </p>
              <p style={{ fontSize: 20, fontWeight: 600 }}>10</p>
            </div>
          </Space>
        </div>
      </Card>

      {/* 工作台导航部分 */}
      <div className="workbench-nav">
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Card>Card content</Card>
          </Col>
          <Col span={12}>
            <Card>Card content</Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Card>Card content</Card>
          </Col>
          <Col span={12}>
            <Card>Card content</Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Card>Card content</Card>
          </Col>
          <Col span={12}>
            <Card>Card content</Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Card>Card content</Card>
          </Col>
          <Col span={12}>
            <Card>Card content</Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Workbench;
