import { Card, Tabs, List, Button, Popconfirm, Modal, Avatar } from "antd";
import {
  getOrderList,
  updateOrderStatus,
  deleteOrder,
  getOrderDetail,
} from "@/apis/order";
import { useEffect, useState } from "react";
import ListComponent from "@/components/ListComponent";

const OrderList = () => {
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
  // 订单列表
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [filteredOrderList, setFilteredOrderList] = useState([]);
  const [open, setOpen] = useState(false);

  //订单详情
  const [orderDetail, setOrderDetail] = useState(null);

  // 获取订单列表
  const fetchOrderList = async () => {
    setLoading(true);
    const res = await getOrderList({ limit: 100 });
    setOrderList(res.items);

    if (currentStatus === "all") {
      setFilteredOrderList(res.items);
    } else {
      const filteredOrderList = res.items.filter(
        (item) => item.status === currentStatus
      );
      setFilteredOrderList(filteredOrderList);
    }
    setLoading(false);
  };

  //分类订单
  const filterOrderList = (status) => {
    if (status === "all") {
      setFilteredOrderList(orderList);
    } else {
      const filteredOrderList = orderList.filter(
        (item) => item.status === status
      );
      setFilteredOrderList(filteredOrderList);
    }
  };

  useEffect(() => {
    fetchOrderList();
    filterOrderList(currentStatus);
  }, []);

  // 订单状态切换
  const onChange = (key) => {
    setCurrentStatus(key);
    filterOrderList(key);
  };

  //修改订单状态
  const handleClick = async (item) => {
    if (item.status === "pending") {
      await updateOrderStatus(item.id, "processing");
    } else if (item.status === "processing") {
      await updateOrderStatus(item.id, "completed");
    } else if (item.status === "completed") {
      await deleteOrder(item.id);
    }
    fetchOrderList();
  };

  //查看详情
  const handleDetail = async (item) => {
    const res = await getOrderDetail(item.id);
    console.log(res);

    setOrderDetail(res);
    setOpen(true);
  };

  return (
    <div className="order-list-container">
      <Card>
        {/* 订单详情 */}
        <Modal
          open={open}
          title="订单详情"
          okButtonProps={{ autoFocus: true, htmlType: "submit" }}
          destroyOnClose
          onCancel={() => setOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setOpen(false)}>
              关闭
            </Button>,
          ]}
        >
          {/* 订单状态 */}
          {orderDetail && (
            <h1>
              {orderDetail.order.status === "pending"
                ? "未接单"
                : orderDetail.order.status === "processing"
                ? "制作中"
                : orderDetail.order.status === "completed"
                ? "已完成"
                : "状态异常"}
            </h1>
          )}
          {/* 订单项 */}
          {orderDetail && (
            <List
              itemLayout="horizontal"
              dataSource={orderDetail.items}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar shape="square" size={64} src={item.image} />
                    }
                    title={
                      <div>
                        <span>{item.menu_item_name}</span>
                        <span style={{ fontSize: "15px", float: "right" }}>
                          {item.subtotal}元
                        </span>
                      </div>
                    }
                    description={
                      <p>{`￥${item.unit_price} x ${item.quantity}份`}</p>
                    }
                  />
                </List.Item>
              )}
            />
          )}

          {/* 订单信息 */}
          {orderDetail && (
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                {/* 总价 */}
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    float: "right",
                  }}
                >
                  总价：{orderDetail.order.total_amount}元
                </span>
                {/* 用户名 */}
                <p>用户名：{orderDetail.order.user_name}</p>
                {/* 手机号 */}
                <p>手机号：{orderDetail.order.phone}</p>
                {/* 地址 */}
                <p>地址：{orderDetail.order.address}</p>
              </div>
              {/* 订单信息 */}
              <p>订单号：{orderDetail.order.order_number}</p>
              <p>订单创建时间：{orderDetail.order.created_at}</p>
            </div>
          )}
        </Modal>

        {/* 订单状态 */}
        <Tabs
          defaultActiveKey="pending"
          centered
          items={status}
          onChange={onChange}
        />

        {/* 订单列表 */}
        <ListComponent
          dataSource={filteredOrderList}
          loading={loading}
          pagination={{
            position: "bottom",
            align: "center",
            pageSize: 3,
          }}
          renderItemContent={(item) => {
            const date = new Date(item.created_at);
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            const hour = String(date.getUTCHours()).padStart(2, "0");
            const minute = String(date.getUTCMinutes()).padStart(2, "0");
            const formatted = `${month}-${day} ${hour}:${minute}`;
            const formattedStatus =
              item.status === "pending"
                ? "未接单"
                : item.status === "processing"
                ? "制作中"
                : item.status === "completed"
                ? "已完成"
                : "状态异常";

            return (
              <List.Item.Meta
                title={
                  <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {item.total_amount}元 {formattedStatus}
                  </div>
                }
                description={
                  <div style={{ whiteSpace: "pre-line" }}>
                    {`用户：${item.user_name}\n地址：${item.address}\n创建时间：${formatted}`}
                  </div>
                }
              />
            );
          }}
          actions={(item) => {
            const result = [];
            if (item.status === "pending") {
              result.push(
                <Popconfirm
                  key="list-loadmore-delete"
                  title="接单"
                  description={`确定要接单吗？`}
                  onConfirm={() => (handleClick ? handleClick(item) : null)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="primary" key="accept">
                    接单
                  </Button>
                </Popconfirm>
              );
            } else if (item.status === "processing") {
              result.push(
                <Popconfirm
                  key="list-loadmore-delete"
                  title="完成"
                  description={`是否完成了订单？`}
                  onConfirm={() => (handleClick ? handleClick(item) : null)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="primary" key="complete">
                    完成
                  </Button>
                </Popconfirm>
              );
            } else {
              result.push(
                <Popconfirm
                  key="list-loadmore-delete"
                  title="删除"
                  description={`确定要删除该订单吗？`}
                  onConfirm={() => (handleClick ? handleClick(item) : null)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button danger key="delete">
                    删除
                  </Button>
                </Popconfirm>
              );
            }
            return [
              <Button key="accept" onClick={() => handleDetail(item)}>
                查看详情
              </Button>,
              ...result,
            ];
          }}
        />
      </Card>
    </div>
  );
};

export default OrderList;
