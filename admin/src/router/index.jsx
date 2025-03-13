import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/Login";
import AdminLayout from "../pages/Layout";
import AuthRoute from "../components/AuthRoute";
import Dashboard from "../pages/Dashboard";
import Menu from "../pages/Menu";
import Order from "../pages/Order";
import User from "../pages/User";
import Report from "../pages/Report";
import Personal from "../pages/Personal";
import Setting from "../pages/Setting";

// 导入三级路由组件
import Workbench from "../pages/Dashboard/Workbench";
import Analysis from "../pages/Dashboard/Analysis";
import Monitor from "../pages/Dashboard/Monitor";
import MenuList from "../pages/Menu/MenuList";
import AddMenu from "../pages/Menu/AddMenu";
import OrderList from "../pages/Order/OrderList";
import OrderStats from "../pages/Order/OrderStats";
import UserList from "../pages/User/UserList";
import SalesData from "../pages/Report/SalesData";
import UserAnalysis from "../pages/Report/UserAnalysis";
import Profile from "../pages/Personal/Profile";
import Messages from "../pages/Personal/Messages";
import BasicInfo from "../pages/Setting/BasicInfo";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRoute>
        <AdminLayout />
      </AuthRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <Workbench />,
          },
          {
            path: "workbench",
            element: <Workbench />,
          },
          {
            path: "analysis",
            element: <Analysis />,
          },
          {
            path: "monitor",
            element: <Monitor />,
          },
        ],
      },
      {
        path: "/menu",
        element: <Menu />,
        children: [
          {
            path: "",
            element: <MenuList />,
          },
          {
            path: "menu-list",
            element: <MenuList />,
          },
          {
            path: "add-menu",
            element: <AddMenu />,
          },
        ],
      },
      {
        path: "/order",
        element: <Order />,
        children: [
          {
            path: "",
            element: <OrderList />,
          },
          {
            path: "order-list",
            element: <OrderList />,
          },
          {
            path: "order-stats",
            element: <OrderStats />,
          },
        ],
      },
      {
        path: "/user",
        element: <User />,
        children: [
          {
            path: "",
            element: <UserList />,
          },
          {
            path: "user-list",
            element: <UserList />,
          },
        ],
      },
      {
        path: "/report",
        element: <Report />,
        children: [
          {
            path: "",
            element: <SalesData />,
          },
          {
            path: "sales-data",
            element: <SalesData />,
          },
          {
            path: "user-analysis",
            element: <UserAnalysis />,
          },
        ],
      },
      {
        path: "/personal",
        element: <Personal />,
        children: [
          {
            path: "",
            element: <Profile />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "messages",
            element: <Messages />,
          },
        ],
      },
      {
        path: "/setting",
        element: <Setting />,
        children: [
          {
            path: "",
            element: <BasicInfo />,
          },
          {
            path: "basic-info",
            element: <BasicInfo />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
