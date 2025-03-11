import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/Login";
import AdminLayout from "../pages/Layout";
import AuthRoute from "../components/AuthRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRoute>
        <AdminLayout />
      </AuthRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
