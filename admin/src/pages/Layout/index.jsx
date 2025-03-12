import { useState } from "react";
import {
  HomeOutlined,
  DesktopOutlined,
  LineChartOutlined,
  DashboardOutlined,
  BuildOutlined,
  BookOutlined,
  PlusOutlined,
  CarryOutOutlined,
  ExpandAltOutlined,
  PieChartOutlined,
  UserOutlined,
  MergeOutlined,
  NodeIndexOutlined,
  BarChartOutlined,
  ControlOutlined,
  MehOutlined,
  IdcardOutlined,
  BellOutlined,
  GatewayOutlined,
  InboxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import avatar from "@/assets/logo.png"
import { Button, Layout, Menu, theme } from "antd";
import "./index.scss";

const { Header, Sider, Content } = Layout;

// 菜单列表
const menuList = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: "Dashboard",
    children: [
      {
        key: "1-1",
        icon: <DesktopOutlined />,
        label: "工作台",
      },
      {
        key: "1-2",
        icon: <LineChartOutlined />,
        label: "分析页",
      },
      {
        key: "1-3",
        icon: <DashboardOutlined />,
        label: "监控页",
      },
    ],
  },
  {
    key: "2",
    icon: <BuildOutlined />,
    label: "菜单管理",
    children: [
      {
        key: "2-1",
        icon: <BookOutlined />,
        label: "菜单列表",
      },
      {
        key: "2-2",
        icon: <PlusOutlined />,
        label: "添加菜品",
      },
    ],
  },
  {
    key: "3",
    icon: <CarryOutOutlined />,
    label: "订单管理",
    children: [
      {
        key: "3-1",
        icon: <ExpandAltOutlined />,
        label: "订单列表",
      },
      {
        key: "3-2",
        icon: <PieChartOutlined />,
        label: "订单统计",
      },
    ],
  },
  {
    key: "4",
    icon: <UserOutlined />,
    label: "用户管理",
    children: [
      {
        key: "4-1",
        icon: <MergeOutlined />,
        label: "用户列表",
      },
    ],
  },
  {
    key: "5",
    icon: <NodeIndexOutlined />,
    label: "统计与报表",
    children: [
      {
        key: "5-1",
        icon: <BarChartOutlined />,
        label: "销售数据",
      },
      {
        key: "5-2",
        icon: <ControlOutlined />,
        label: "用户分析",
      },
    ],
  },
  {
    key: "6",
    icon: <MehOutlined />,
    label: "个人中心",
    children: [
      {
        key: "6-1",
        icon: <IdcardOutlined />,
        label: "我的资料",
      },
      {
        key: "6-2",
        icon: <BellOutlined />,
        label: "消息通知",
      },
    ],
  },
  {
    key: "7",
    icon: <GatewayOutlined />,
    label: "店铺设置",
    children: [
      {
        key: "7-1",
        icon: <InboxOutlined />,
        label: "基本信息",
      },
    ],
  },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="admin-layout">
      {/* 侧边栏导航栏 */}
      <Sider
        className="admin-layout-sider"
        collapsedWidth={0}
        width={200}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <Menu
          className="admin-layout-menu"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuList}
        />
      </Sider>

      {/* 主要内容部分 */}
      <Layout className="admin-layout-content">
        {/* 遮罩层 */}
        {!collapsed && (
          <div className="layout-mask" onClick={() => setCollapsed(true)} />
        )}

        {/* 头部 */}
        <Header
          className="admin-layout-header"
          style={{ padding: 0, background: colorBgContainer }}
        >
          <div className="header-left">
            {/* 折叠导航按钮 */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />

            {/* 刷新按钮 */}
            <Button
              type="text"
              icon={<ReloadOutlined />}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </div>

          {/* 用户信息 */}
          <div className="header-right">
            <div className="headeravatar">
              <span>
                <img src={avatar} alt="avatar" className="avatar-img" />
              </span>
            </div>
          </div>
        </Header>
        <Content
          className="admin-layout-content"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
