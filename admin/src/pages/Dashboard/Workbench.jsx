import { useNavigate } from "react-router-dom";
import { Card, Avatar, Space, Col, Row, Timeline } from "antd";
import avatar from "@/assets/logo.png";
import Icon from "@ant-design/icons";
import RainOutlineSvg from "@/assets/Icons/RainOutline.svg?react";
import ProjectMapSvg from "@/assets/Icons/ProjectMap.svg?react";
import TodoSvg from "@/assets/Icons/Todo.svg?react";
import MessageSvg from "@/assets/Icons/Message.svg?react";
import {
  UserOutlined,
  BookOutlined,
  CarryOutOutlined,
  BarChartOutlined,
  BellOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import "./Workbench.scss";

const Workbench = () => {
  const navigate = useNavigate();

  // 简化后的 handleCardClick 函数，只负责路由跳转
  const handleCardClick = (key) => {
    navigate(key);
  };

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
                  padding: 3,
                  borderRadius: 5,
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
                  padding: 3,
                  borderRadius: 5,
                  backgroundColor: "#fff7e1",
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
                  padding: 3,
                  borderRadius: 5,
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
        <Row gutter={16} className="row-item">
          <Col span={12}>
            <Card
              className="nav-card-item"
              hoverable={true}
              onClick={() => handleCardClick("/user/user-list")}
            >
              <p>
                <Icon
                  component={UserOutlined}
                  style={{ fontSize: 25, color: "#69c0ff" }}
                />
              </p>
              <p>用户</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              className="nav-card-item"
              hoverable={true}
              onClick={() => handleCardClick("/menu/menu-list")}
            >
              <p>
                <BookOutlined style={{ fontSize: 25, color: "#95de64" }} />
              </p>
              <p>菜单</p>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} className="row-item">
          <Col span={12}>
            <Card
              className="nav-card-item"
              hoverable={true}
              onClick={() => handleCardClick("/order/order-list")}
            >
              <p>
                <CarryOutOutlined style={{ fontSize: 25, color: "#ff9c6e" }} />
              </p>
              <p>订单</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              className="nav-card-item"
              hoverable={true}
              onClick={() => handleCardClick("/report/sales-data")}
            >
              <p>
                <BarChartOutlined style={{ fontSize: 25, color: "#b37feb" }} />
              </p>
              <p>销售</p>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} className="row-item">
          <Col span={12}>
            <Card
              className="nav-card-item"
              hoverable={true}
              onClick={() => handleCardClick("/personal/messages")}
            >
              <p>
                <BellOutlined style={{ fontSize: 25, color: "#ffd666" }} />
              </p>
              <p>消息</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              className="nav-card-item"
              hoverable={true}
              onClick={() => handleCardClick("/setting/basic-info")}
            >
              <p>
                <InboxOutlined style={{ fontSize: 25, color: "#5cdbd3" }} />
              </p>
              <p>店铺</p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 最新动态 */}
      <Card title="最新动态" className="timeline">
        <Timeline
          items={[
            {
              color: "green",
              children: "Create a services site 2015-09-01",
            },
            {
              color: "green",
              children: "Create a services site 2015-09-01",
            },
          ]}
        ></Timeline>
      </Card>
    </div>
  );
};

export default Workbench;
