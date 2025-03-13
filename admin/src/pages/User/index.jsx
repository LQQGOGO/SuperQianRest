 import { Outlet } from "react-router-dom";

const User = () => {
  return (
    <div className="user-container">
      <Outlet />
    </div>
  );
};

export default User;
