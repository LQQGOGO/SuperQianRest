import { getPersonalProfile, updatePersonalProfile } from "../../apis/personal";
import { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Form,
  Divider,
  Tag,
  Tabs,
  Input,
  Button,
  message,
  List,
} from "antd";
import Icon from "@ant-design/icons";
import PhoneIcon from "../../assets/Icons/Phone.svg?react";
import RoleIcon from "../../assets/Icons/Role.svg?react";
import EmailIcon from "../../assets/Icons/Email.svg?react";
import QQIcon from "../../assets/Icons/QQ.svg?react";
import WechatIcon from "../../assets/Icons/Wechat.svg?react";
import AliPayIcon from "../../assets/Icons/AliPay.svg?react";
import "./Profile.scss";
import UploadImage from "../../components/UploadImage";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [countdown, setCountdown] = useState(0);

  // 获取个人信息数据
  const fetchPersonalProfile = async () => {
    const res = await getPersonalProfile();
    setProfile(res);
  };

  useEffect(() => {
    fetchPersonalProfile();
  }, []);

  // 倒计时
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer); // 清除定时器
  }, [countdown]);

  // 标签列表
  const tagsList = [
    {
      id: 1,
      name: "乐观",
    },
    {
      id: 2,
      name: "积极",
    },
    {
      id: 3,
      name: "自信",
    },
    {
      id: 4,
      name: "勇敢",
    },
    {
      id: 5,
      name: "坚强",
    },
    {
      id: 6,
      name: "有想法",
    },
  ];

  const tagColors = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ];

  // 随机取一个颜色
  const getRandomColor = () => {
    const index = Math.floor(Math.random() * tagColors.length);
    return tagColors[index];
  };

  const onFinish = async (values) => {
    const res = await updatePersonalProfile(values);
    message.success(res.message);
    setCountdown(60);
  };

  return (
    <div className="profile-container">
      {/* 信息展示卡片 */}
      {profile && (
        <Card>
          {/* 头像信息 */}
          <div className="avatar-info">
            <Avatar src={profile.avatar} size={100} />
            <h2>{profile.name}</h2>
          </div>

          {/* 个人信息 */}
          <div className="personal-info">
            <p>
              <Icon component={PhoneIcon} style={{ marginRight: 10 }} />
              <span>{profile.phone}</span>
            </p>
            <p>
              <Icon component={EmailIcon} style={{ marginRight: 10 }} />
              <span>{profile.email}</span>
            </p>
            <p>
              <Icon component={RoleIcon} style={{ marginRight: 10 }} />
              <span>
                {profile.role == "admin"
                  ? "管理员"
                  : profile.role == "customer"
                  ? "用户"
                  : profile.role == "staff"
                  ? "员工"
                  : "未知"}
              </span>
            </p>
          </div>

          <Divider />

          {/* 个人标签 */}
          <div className="personal-tags">
            <p>标签</p>
            <div className="tags-list">
              {tagsList.map((tag) => (
                <Tag key={tag.id} color={getRandomColor()}>
                  {tag.name}
                </Tag>
              ))}
            </div>
          </div>
        </Card>
      )}
      {/* 信息表单 */}
      {profile && (
        <Card>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "基本信息",
                children: (
                  <Form onFinish={onFinish}>
                    {/* 头像 */}
                    <Form.Item
                      label="头像"
                      name="avatar"
                      rules={[
                        {
                          required: true,
                          message: "请上传头像",
                        },
                      ]}
                      initialValue={profile.avatar}
                    >
                      <UploadImage />
                    </Form.Item>
                    {/* 姓名 */}
                    <Form.Item
                      label="姓名"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "请输入姓名",
                        },
                      ]}
                      initialValue={profile.name}
                    >
                      <Input />
                    </Form.Item>
                    {/* 手机号 */}
                    <Form.Item
                      label="手机号"
                      name="phone"
                      rules={[{ required: true, message: "请输入手机号" }]}
                      initialValue={profile.phone}
                    >
                      <Input />
                    </Form.Item>
                    {/* 邮箱 */}
                    <Form.Item
                      label="邮箱"
                      name="email"
                      rules={[{ required: true, message: "请输入邮箱" }]}
                      initialValue={profile.email}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={countdown > 0}
                      >
                        {countdown > 0 ? `${countdown}秒后可修改` : "保存更改"}
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: "2",
                label: "账号绑定",
                children: (
                  <List>
                    {/* 密保手机 */}
                    <List.Item
                      actions={[<a key="list-edit">去修改</a>]}
                    >
                      <List.Item.Meta
                        title="密保手机"
                        description={`已绑定手机：${profile.phone}`}
                      />
                    </List.Item>
                    {/* 密保邮箱 */}
                    <List.Item
                      actions={[<a key="list-edit">去修改</a>]}
                    >
                      <List.Item.Meta
                        title="密保邮箱"
                        description={`已绑定邮箱：${profile.email}`}
                      />
                    </List.Item>
                    {/* 密保问题 */}
                    <List.Item
                      actions={[<a key="list-edit">去设置</a>]}
                    >
                      <List.Item.Meta
                        title="密保问题"
                        description={`未设置密保问题`}
                      />
                    </List.Item>
                    {/* 绑定QQ */}
                    <List.Item
                      actions={[<a key="list-edit">去绑定</a>]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Icon component={QQIcon} style={{ fontSize: 50 }} />
                        }
                        title="绑定QQ"
                        description={`当前未绑定QQ账号`}
                      />
                    </List.Item>
                    {/* 绑定微信 */}
                    <List.Item
                      actions={[<a key="list-edit">去绑定</a>]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Icon
                            component={WechatIcon}
                            style={{ fontSize: 50 }}
                          />
                        }
                        title="绑定微信"
                        description={`当前未绑定微信账号`}
                      />
                    </List.Item>
                    {/* 绑定支付宝 */}
                    <List.Item
                      actions={[<a key="list-edit">去绑定</a>]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Icon
                            component={AliPayIcon}
                            style={{ fontSize: 50 }}
                          />
                        }
                        title="绑定支付宝"
                        description={`当前未绑定支付宝账号`}
                      />
                    </List.Item>
                  </List>
                ),
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default Profile;
