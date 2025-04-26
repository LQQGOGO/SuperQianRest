import { Card, Avatar, List } from "antd";

const orderMessages = [
  {
    id: 1,
    status: "新订单",
    message: "您有新的订单，请及时处理",
    order: {
      id: 1,
      name: "订单1",
      price: 100,
      status: "未接单",
    },
  },
  {
    id: 2,
    status: "取消订单",
    message: "订单2已取消",
    order: {
      id: 2,
      name: "订单2",
      price: 200,
      status: "已取消",
    },
  },
  {
    id: 3,
    status: "制作中",
    message: "订单已接单，请及时制作",
    order: {
      id: 3,
      name: "订单3",
      price: 300,
      status: "制作中",
    },
  },
];

const Messages = () => {
  return (
    <div className="messages-container">
      <Card title="订单通知">
        <List
          itemLayout="horizontal"
          dataSource={orderMessages}
          renderItem={(item) => (
            <List.Item>
              <div className="message-item">
                <span className="message-item-status">[{item.status}]</span>
                <span className="message-item-order">
                  <span className="message-item-order-name">{item.order.name}</span>
                  <span className="message-item-order-price">{item.order.price}</span>
                </span>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Messages;
