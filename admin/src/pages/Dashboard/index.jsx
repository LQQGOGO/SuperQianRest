import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Outlet />
    </div>
  );
};

export default Dashboard;
