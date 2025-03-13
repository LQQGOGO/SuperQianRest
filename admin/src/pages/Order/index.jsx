import { Outlet } from "react-router-dom";

const Order = () => {
  return (
    <div className="order-container">
      <Outlet />
    </div>
  );
};

export default Order;
