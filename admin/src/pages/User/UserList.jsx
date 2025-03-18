import { useEffect, useState } from "react";
import { getUserList } from "@/apis/user";
import { Avatar, List, Space, Card } from "antd";
import "./UserList.scss";

const UserList = () => {
  const [users, setUsers] = useState([]);

  /* 获取用户列表 */
  useEffect(() => {
    const getUsers = async () => {
      try {
        const userList = await getUserList();
        console.log(userList.items);
        setUsers(userList.items);
      } catch (error) {
        console.error("获取用户列表失败:", error);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="user-list-container">
      <Card>
        <List
          pagination={{
            position: "bottom",
            align: "center",
            pageSize: 8,
          }}
          style={{
            height: "650px",
          }}
          dataSource={users}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.username}
                description={item.email}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default UserList;
