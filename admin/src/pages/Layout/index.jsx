import { useState, useEffect } from "react";
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
  ReloadOutlined,
  DownOutlined,
  EditOutlined,
  LogoutOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import avatar from "@/assets/logo.png";
import { Button, Layout, Menu, theme, Dropdown, Space, Tabs, Avatar } from "antd";
import "./index.scss";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

// 菜单列表
const menuList = [
  {
    key: "/dashboard",
    icon: <HomeOutlined />,
    label: "Dashboard",
    children: [
      {
        key: "/dashboard/workbench",
        icon: <DesktopOutlined />,
        label: "工作台",
      },
      {
        key: "/dashboard/analysis",
        icon: <LineChartOutlined />,
        label: "分析页",
      },
      {
        key: "/dashboard/monitor",
        icon: <DashboardOutlined />,
        label: "监控页",
      },
    ],
  },
  {
    key: "/menu",
    icon: <BuildOutlined />,
    label: "菜单管理",
    children: [
      {
        key: "/menu/menu-list",
        icon: <BookOutlined />,
        label: "菜单列表",
      },
      {
        key: "/menu/add-menu",
        icon: <PlusOutlined />,
        label: "添加菜品",
      },
    ],
  },
  {
    key: "/order",
    icon: <CarryOutOutlined />,
    label: "订单管理",
    children: [
      {
        key: "/order/order-list",
        icon: <ExpandAltOutlined />,
        label: "订单列表",
      },
      {
        key: "/order/order-stats",
        icon: <PieChartOutlined />,
        label: "订单统计",
      },
    ],
  },
  {
    key: "/user",
    icon: <UserOutlined />,
    label: "用户管理",
    children: [
      {
        key: "/user/user-list",
        icon: <MergeOutlined />,
        label: "用户列表",
      },
    ],
  },
  {
    key: "/report",
    icon: <NodeIndexOutlined />,
    label: "统计与报表",
    children: [
      {
        key: "/report/sales-data",
        icon: <BarChartOutlined />,
        label: "销售数据",
      },
      {
        key: "/report/user-analysis",
        icon: <ControlOutlined />,
        label: "用户分析",
      },
    ],
  },
  {
    key: "/personal",
    icon: <MehOutlined />,
    label: "个人中心",
    children: [
      {
        key: "/personal/profile",
        icon: <IdcardOutlined />,
        label: "我的资料",
      },
      {
        key: "/personal/messages",
        icon: <BellOutlined />,
        label: "消息通知",
      },
    ],
  },
  {
    key: "/setting",
    icon: <GatewayOutlined />,
    label: "店铺设置",
    children: [
      {
        key: "/setting/basic-info",
        icon: <InboxOutlined />,
        label: "基本信息",
      },
    ],
  },
];

// 消息通知下拉菜单
const MessageDropdownItems = [
  {
    label: (
      <Button type="text" icon={<BellOutlined />}>
        消息通知
      </Button>
    ),
    key: "0",
  },
  {
    label: (
      <Button type="text" icon={<BulbOutlined />}>
        系统消息
      </Button>
    ),
    key: "1",
  },
];

// 用户下拉菜单
const UserDropdownItems = [
  {
    label: (
      <Button type="text" icon={<UserOutlined />}>
        个人中心
      </Button>
    ),
    key: "0",
  },
  {
    label: (
      <Button type="text" icon={<EditOutlined />}>
        修改密码
      </Button>
    ),
    key: "1",
  },
  {
    label: (
      <Button type="text" icon={<LogoutOutlined />}>
        退出登录
      </Button>
    ),
    key: "2",
  },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  // 从 localStorage 读取数据
  const storedTabs = JSON.parse(sessionStorage.getItem("tabs")) || [
    { key: "/dashboard/workbench", label: "工作台", closable: false },
  ];
  const storedActiveKey =
    sessionStorage.getItem("activeKey") || storedTabs[0].key;

  const [tabs, setTabs] = useState(storedTabs);
  const [activeKey, setActiveKey] = useState(storedActiveKey);

  // 将 tabs 和 activeKey 存储到 sessionStorage
  useEffect(() => {
    sessionStorage.setItem("tabs", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    sessionStorage.setItem("activeKey", activeKey);
  }, [activeKey]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  // 根据 key 找到对应的 label
  const findLabelByKey = (key, menuList) => {
    for (const item of menuList) {
      if (item.key === key) {
        return item.label;
      }
      if (item.children) {
        const foundLabel = findLabelByKey(key, item.children);
        if (foundLabel) {
          return foundLabel;
        }
      }
    }
    return null; // 如果未找到，返回 null
  };

  // 点击菜单项
  const handleMenuClick = (e) => {
    const key = e.key;
    const label = findLabelByKey(key, menuList);
    setTabs((prevTabs) => {
      // 检查 key 是否已存在，避免重复添加
      if (prevTabs.some((tab) => tab.key === key)) {
        return prevTabs; // 如果已存在，则不添加
      }
      return [...prevTabs, { key, label }];
    });
    setCollapsed(true);
    setActiveKey(key);
    navigate(key);
  };

  // 编辑页签
  const onChange = (newActiveKey) => {
    navigate(newActiveKey);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    tabs.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabs.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setTabs(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (targetKey) => {
    remove(targetKey);
  };
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
          defaultSelectedKeys={["/dashboard"]}
          items={menuList}
          onClick={handleMenuClick}
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
                width: 40,
                height: 40,
              }}
            />

            {/* 刷新按钮 */}
            <Button
              type="text"
              icon={<ReloadOutlined />}
              style={{
                fontSize: "16px",
                width: 40,
                height: 40,
              }}
            />
          </div>
          {/* 用户信息 */}
          <div className="header-right">
            {/* 消息通知 */}
            <Dropdown
              menu={{
                items: MessageDropdownItems,
              }}
              placement="bottom"
            >
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{
                  fontSize: "16px",
                  width: 40,
                  height: 40,
                }}
              />
            </Dropdown>

            {/* 头像 */}
            <Dropdown
              menu={{
                items: UserDropdownItems,
              }}
              placement="bottomLeft"
            >
              <Space>
                <div className="headeravatar">
                  <span className="el-avatar">
                    <Avatar src={avatar} />
                  </span>
                  <span className="el-icon">
                    <DownOutlined />
                  </span>
                </div>
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* 页签导航 */}
        
          <Tabs
            type="editable-card"
            hideAdd={true}
            onChange={onChange}
            activeKey={activeKey}
            onEdit={onEdit}
            items={tabs}
            className="admin-layout-tabs"
          />
        

        <Content
          className="admin-layout-content"
          style={{
            padding: 20,
            minHeight: 280,
            background: "#f0f2f5",
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
