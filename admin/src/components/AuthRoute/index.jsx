import { Navigate } from "react-router-dom";
import { getToken } from "@/utils/token";

const AuthRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" />;
};

export default AuthRoute;
