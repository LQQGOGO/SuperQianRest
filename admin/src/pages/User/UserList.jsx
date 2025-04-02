import { useEffect, useState, useCallback } from "react";
import { getUserList } from "@/apis/user";
import {
  Avatar,
  List,
  Space,
  Card,
  Input,
  Empty,
  message,
  Button,
  Form,
  Modal,
} from "antd";
import Icon from "@ant-design/icons";
import AddSvg from "@/assets/Icons/Add.svg?react";
import DeleteSvg from "@/assets/Icons/Delete.svg?react";
import { debounce } from "@/utils/debounce";
import UploadImage from "@/components/UploadImage";
import "./UserList.scss";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // 存储所有用户，用于过滤
  const [loading, setLoading] = useState(false);

  /* 获取用户列表 */
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const userList = await getUserList();
        setUsers(userList.items);
        setAllUsers(userList.items); // 保存所有用户
      } catch (error) {
        console.error("获取用户列表失败:", error);
        message.error("获取用户列表失败");
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  // 使用 useCallback 和防抖函数包装搜索逻辑
  const debouncedSearch = useCallback(
    debounce((value) => {
      if (!value) {
        // 如果搜索值为空，显示所有用户
        setUsers(allUsers);
        return;
      }
      // 在所有用户中过滤匹配的邮箱
      const filteredUsers = allUsers.filter((user) =>
        user.email.toLowerCase().includes(value.toLowerCase())
      );
      // 更新显示过滤后的用户列表
      setUsers(filteredUsers);
    }, 300),
    [allUsers]
  );

  // 处理输入变化
  const handleChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  //用户信息表单
  const [formTitle, setFormTitle] = useState("新建用户");
  const [formInitialValues, setFormInitialValues] = useState({
    username: "",
    email: "",
    avatar: "",
  });
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState();
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setFormValues(values);
    setOpen(false);
  };

  return (
    <div className="user-list-container">
      <Card>
        {/* 用户表单 */}
        <Modal
          open={open}
          title={formTitle}
          okText="完成"
          cancelText="取消"
          okButtonProps={{
            autoFocus: true,
            htmlType: "submit",
          }}
          onCancel={() => setOpen(false)}
          destroyOnClose
          modalRender={(dom) => (
            <Form
              layout="vertical"
              form={form}
              name="user_form"
              initialValues={formInitialValues}
              clearOnDestroy
              onFinish={(values) => onCreate(values)}
            >
              {dom}
            </Form>
          )}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                required: true,
                message: "请输入邮箱",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="avatar"
            label="头像"
            rules={[
              {
                required: true,
                message: "请上传头像",
              },
            ]}
          >
            <UploadImage />
          </Form.Item>
        </Modal>
        {/* 添加和删除 */}
        <Space className="user-list-button">
          <Button
            type="primary"
            color="primary"
            onClick={() => {
              setFormTitle("新建用户");
              setFormInitialValues({
                username: "",
                email: "",
                avatar: "",
              });
              setOpen(true);
            }}
          >
            <Icon
              component={AddSvg}
              style={{ width: 15, height: 15, color: "#fff" }}
            />
            新建
          </Button>
          <Button type="primary" danger>
            <Icon
              component={DeleteSvg}
              style={{ width: 15, height: 15, color: "#fff" }}
            />
            删除
          </Button>
        </Space>
        {/* 搜索框 */}
        <Input
          placeholder="输入邮箱查找用户"
          allowClear
          onChange={handleChange}
          style={{ marginBottom: 25 }}
        />
        {/* 用户列表 */}
        <List
          loading={loading}
          pagination={{
            position: "bottom",
            align: "center",
            pageSize: 5,
          }}
          style={{
            height: "650px",
          }}
          dataSource={users}
          locale={{ emptyText: <Empty description="暂无用户数据" /> }}
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
