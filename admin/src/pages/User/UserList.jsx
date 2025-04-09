import { useEffect, useState, useCallback } from "react";
import { getUserList, createUser, editUser, deleteUser } from "@/apis/user";
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
  Radio,
  Popconfirm,
} from "antd";
import Icon from "@ant-design/icons";
import AddSvg from "@/assets/Icons/Add.svg?react";
import { debounce } from "@/utils/debounce";
import UploadImage from "@/components/UploadImage";
import ListComponent from "@/components/ListComponent";
import "./UserList.scss";

const UserList = () => {
  const [users, setUsers] = useState([]); // 存储用户列表,用于显示
  const [allUsers, setAllUsers] = useState([]); // 存储所有用户，用于过滤
  const [loading, setLoading] = useState(false);

  /* 获取用户列表 */
  useEffect(() => {
    fetchUserList();
  }, []);

  // 获取用户列表的函数
  const fetchUserList = async () => {
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
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const onCreate = async (values) => {
    try {
      let res;
      if (formTitle === "新建用户") {
        res = await createUser(values);
      } else {
        res = await editUser(editingUser.id, values);
      }

      if (res && res.message) {
        message.success(res.message);
        setOpen(false);
        fetchUserList(); // 添加或编辑用户后刷新列表
      }
    } catch (error) {
      console.error("操作失败:", error);
    }
  };

  const handleEdit = (item) => {
    setFormTitle("编辑用户");

    // 打开前重置表单
    form.resetFields();
    setOpen(true);

    // 设置表单值
    form.setFieldsValue({
      username: item.username,
      email: item.email,
      avatar: item.avatar,
      name: item.name,
      phone: item.phone,
      role: item.role,
    });
    setEditingUser(item);
  };

  const handleDelete = async (item) => {
    try {
      const res = await deleteUser(item.id);
      if (res && res.message) {
        message.success(res.message);
        fetchUserList(); // 删除后刷新列表
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
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
          forceRender
          modalRender={(dom) => (
            <Form
              layout="vertical"
              form={form}
              name="user_form"
              initialValues={{
                role: "admin",
                username: "",
                password: "",
                email: "",
                name: "",
                phone: "",
                avatar: "",
              }}
              onFinish={(values) => onCreate(values)}
              preserve={false}
            >
              {dom}
            </Form>
          )}
        >
          {/* 用户账号 */}
          <Form.Item
            name="username"
            label="用户账号"
            rules={[
              {
                required: true,
                message: "请输入用户账号",
              },
              {
                pattern: /^[0-9a-zA-Z]{3,16}$/,
                message: "应为长度在3-16位数字或字母的账号",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* 密码 */}
          {formTitle === "新建用户" && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                  message: "请输入登录密码",
                },
                {
                  pattern: /^.{6,16}$/,
                  message: "应为长度在6-16位的密码",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}
          {/* 用户昵称 */}
          <Form.Item
            name="name"
            label="用户昵称"
            rules={[
              {
                required: true,
                message: "请输入用户昵称",
              },
              {
                pattern: /^.{1,16}$/,
                message: "应为长度在1-16位的昵称",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* 手机号 */}
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              {
                required: true,
                message: "请输入手机号",
              },
              {
                pattern: /^.{11}$/,
                message: "应为11位数字的手机号",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* 邮箱 */}
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                required: true,
                message: "请输入邮箱",
              },
              {
                pattern:
                  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|cn|net|org|edu|gov|info|io|me)$/,
                message: "请输入正确邮箱",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* 身份 */}
          <Form.Item
            name="role"
            label="身份"
            rules={[
              {
                required: true,
                message: "请选择身份",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="admin">管理员</Radio>
              <Radio value="staff">员工</Radio>
              <Radio value="customer">顾客</Radio>
            </Radio.Group>
          </Form.Item>
          {/* 头像 */}
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

              // 打开前重置表单
              form.resetFields();
              setOpen(true);
            }}
          >
            <Icon
              component={AddSvg}
              style={{ width: 15, height: 15, color: "#fff" }}
            />
            新建
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
        <ListComponent
          loading={loading}
          pagination={{
            position: "bottom",
            align: "center",
            pageSize: 7,
          }}
          dataSource={users}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          renderItemContent={(item) => (
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={item.name}
              description={item.email}
            />
          )}
        ></ListComponent>
        {/* <List
          loading={loading}
          pagination={{
            position: "bottom",
            align: "center",
            pageSize: 7,
          }}
          style={{
            height: "650px",
          }}
          dataSource={users}
          locale={{ emptyText: <Empty description="暂无用户数据" /> }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a key="list-loadmore-edit" onClick={() => handleEdit(item)}>
                  编辑
                </a>,
                <Popconfirm
                  key="list-loadmore-delete"
                  title="删除用户"
                  description={`确定要删除用户 "${item.name}" 吗？`}
                  onConfirm={() => handleDelete(item)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a>删除</a>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.name}
                description={item.email}
              />
            </List.Item>
          )}
        /> */}
      </Card>
    </div>
  );
};

export default UserList;
