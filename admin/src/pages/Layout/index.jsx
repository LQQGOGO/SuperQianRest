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
import {
  Button,
  Layout,
  Menu,
  theme,
  Dropdown,
  Space,
  Tabs,
  Avatar,
  Badge,
} from "antd";
import "./index.scss";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { getOrderList } from "@/apis/order";

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
        key: "/menu/category-list",
        icon: <PlusOutlined />,
        label: "菜品种类",
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
      // {
      //   key: "/report/user-analysis",
      //   icon: <ControlOutlined />,
      //   label: "用户分析",
      // },
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
      // {
      //   key: "/personal/messages",
      //   icon: <BellOutlined />,
      //   label: "消息通知",
      // },
    ],
  },
  {
    key: "/setting",
    icon: <GatewayOutlined />,
    label: "系统设置",
    children: [
      {
        key: "/setting/basic-info",
        icon: <InboxOutlined />,
        label: "基本信息",
      },
    ],
  },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const [newOrder, setNewOrder] = useState([]);
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("theme") || "light"
  );

  // 初始化主题
  useEffect(() => {
    document.body.className = themeMode;
  }, []);

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }) => {
    if (key === "1") {
      navigate("/personal/profile");
    } else if (key === "2") {
      localStorage.removeItem("6627");
      navigate("/login");
    } else if (key === "3") {
      const newTheme = themeMode === "light" ? "dark" : "light";
      setThemeMode(newTheme);
      document.body.className = newTheme;
      localStorage.setItem("theme", newTheme);
    }
  };

  // 用户下拉菜单
  const UserDropdownItems = [
    {
      key: "1",
      label: "个人中心",
      icon: <EditOutlined />,
    },
    {
      key: "2",
      label: "退出登录",
      icon: <LogoutOutlined />,
    },
    {
      key: "3",
      label: themeMode === "light" ? "切换黑夜模式" : "切换白天模式",
      icon: <BulbOutlined />,
    },
  ];

  // 消息通知下拉菜单
  const MessageDropdownItems = [
    {
      key: "1",
      label: (
        <Badge dot={newOrder.length > 0}>
          <a
            onClick={() => navigate("/order/order-list")}
            style={{ color: "black", cursor: "pointer" }}
          >
            订单
          </a>
        </Badge>
      ),
    },
  ];

  // 从 localStorage 读取数据
  const storedTabs = JSON.parse(sessionStorage.getItem("tabs")) || [
    { key: "/dashboard/workbench", label: "工作台", closable: false },
  ];
  const storedActiveKey =
    sessionStorage.getItem("activeKey") || storedTabs[0].key;

  const [tabs, setTabs] = useState(storedTabs);
  const [activeKey, setActiveKey] = useState(storedActiveKey);

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

  // 监听路由变化，自动更新 tabs
  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath.split("/").length > 2) {
      // 如果当前路径不在 tabs 中，则添加
      if (!tabs.some((tab) => tab.key === currentPath)) {
        const label = findLabelByKey(currentPath, menuList);
        if (label) {
          const newTab = { key: currentPath, label, closable: true };
          setTabs((prevTabs) => [...prevTabs, newTab]);
        }
      }
    }

    // 更新当前活动的 tab
    setActiveKey(currentPath);

    // 将 tabs 和 activeKey 存储到 sessionStorage
    sessionStorage.setItem("activeKey", currentPath);
  }, [location.pathname]);

  // 将 tabs 存储到 sessionStorage
  useEffect(() => {
    sessionStorage.setItem("tabs", JSON.stringify(tabs));
  }, [tabs]);

  // 点击菜单项
  const handleMenuClick = (e) => {
    const key = e.key;
    setCollapsed(true);
    navigate(key);
    // 不需要在这里更新 tabs，因为路由变化会触发 useEffect
  };

  // 编辑页签
  const onTabClick = (newActiveKey) => {
    navigate(newActiveKey);
    // 不需要在这里设置 activeKey，因为路由变化会触发 useEffect
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

    // 对tabs进行去重处理，以key作为唯一标识
    const uniqueNewPanes = Array.from(
      new Map(newPanes.map((item) => [item.key, item])).values()
    );

    setTabs(uniqueNewPanes);
    navigate(newActiveKey);
    // 不需要在这里设置 activeKey，因为路由变化会触发 useEffect
  };

  const onEdit = (targetKey) => {
    remove(targetKey);
  };

  // 获取新订单
  const getNewOrder = async () => {
    const res = await getOrderList({ status: "pending" });
    setNewOrder(res.items);
  };

  useEffect(() => {
    getNewOrder();
  }, []);

  return (
    <Layout className="admin-layout">
      {/* 侧边栏导航栏 */}
      <Sider
        className="admin-layout-sider"
        // collapsedWidth={0}
        // width={200}
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
          <div
            className="layout-mask"
            onClick={() => {
              setCollapsed(true);
              // document.body.style.overflow = "auto";
            }}
          />
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
              onClick={() => {
                setCollapsed(!collapsed);
                // document.body.style.overflow = "hidden";
              }}
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
              onClick={() => window.location.reload()}
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
                onClick: handleUserMenuClick,
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
          onTabClick={onTabClick}
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
