import { Outlet } from "react-router-dom";

const Menu = () => {
  return (
    <div className="menu-container">
      <Outlet />
    </div>
  );
};

export default Menu;
