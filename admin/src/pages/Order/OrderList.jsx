import { Card, Tabs, Table } from "antd";

const OrderList = () => {
  const onChange = (key) => {
    console.log(key);
  };
  // 订单状态
  const status = [
    {
      key: "all",
      label: <span style={{ fontSize: "20px" }}>全部</span>,
    },
    {
      key: "pending",
      label: <span style={{ fontSize: "20px" }}>未接单</span>,
    },
    {
      key: "processing",
      label: <span style={{ fontSize: "20px" }}>制作中</span>,
    },
    {
      key: "completed",
      label: <span style={{ fontSize: "20px" }}>已完成</span>,
    },
  ];
  return (
    <div className="order-list-container">
      <Card>
        {/* 订单状态 */}
        <Tabs
          defaultActiveKey="pending"
          centered
          items={status}
          onChange={onChange}
        />

        {/* 订单列表 */}
        <Table
          
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default OrderList;
