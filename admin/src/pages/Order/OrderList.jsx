import { Card, Tabs, List, Button } from "antd";
import { getOrderList, getOrderDetail } from "@/apis/order";
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

  // 获取订单列表
  const fetchOrderList = async () => {
    const res = await getOrderList({ limit: 100 });
    setOrderList(res.items);
    console.log(res.items);

    if (currentStatus === "all") {
      setFilteredOrderList(res.items);
    } else {
      const filteredOrderList = res.items.filter(
        (item) => item.status === currentStatus
      );
      setFilteredOrderList(filteredOrderList);
    }
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

  const handleDelete = (id) => {
    console.log(id);
  };

  const handleEdit = (id) => {
    console.log(id);
  };

  const onChange = (key) => {
    setCurrentStatus(key);
    filterOrderList(key);
  };

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
        <div className="menu-list-content">
          <ListComponent
            dataSource={filteredOrderList}
            loading={loading}
            pagination={{
              position: "bottom",
              align: "center",
              pageSize: 5,
            }}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
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
              if (item.status === "pending") {
                return [
                  <Button
                    type="primary"
                    key="accept"
                    onClick={() => handleEdit(item.id)}
                  >
                    接单
                  </Button>,
                ];
              } else if (item.status === "processing") {
                return [
                  <Button
                    type="primary"
                    key="complete"
                    onClick={() => handleEdit(item.id)}
                  >
                    完成
                  </Button>,
                ];
              } else {
                return [
                  <Button
                    danger
                    key="delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    删除
                  </Button>,
                ];
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default OrderList;
