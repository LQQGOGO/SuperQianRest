import { createBrowserRouter, Navigate } from "react-router-dom";


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
import CategoryList from "../pages/Menu/CategoryList";
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
        path: "",
        element: <Navigate to="/dashboard" />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <Navigate to="/dashboard/workbench" />,
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
            element: <Navigate to="/menu/menu-list"   />,
          },
          {
            path: "menu-list",
            element: <MenuList />,
          },
          {
            path: "category-list",
            element: <CategoryList />,
          },
        ],
      },
      {
        path: "/order",
        element: <Order />,
        children: [
          {
            path: "",
            element: <Navigate to="/menu/menu-list" />,
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
            element: <Navigate to="/user/user-list" />,
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
            element: <Navigate to="/report/sales-data" />,
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
            element: <Navigate to="/personal/profile" />,
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
            element: <Navigate to="/setting/basic-info" />,
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
