import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/Login";
import AdminLayout from "../pages/Layout";
import AuthRoute from "../components/AuthRoute";
import Dashboard from "../pages/Dashboard";
import Menu from "../pages/Menu";
import Order from "../pages/Order";

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
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/order",
        element: <Order />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
