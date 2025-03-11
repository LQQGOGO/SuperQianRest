import { Card, Form, Input, Button } from "antd";
import "./index.scss";
import title from "../../assets/title.jpg";
import { useDispatch } from "react-redux";
import { fetchLogin } from "../../store/modules/user";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 点击登录按钮时触发 获取表单数据
  const onFinish = async (formValue) => {
    await dispatch(fetchLogin(formValue));
    navigate("/");
    message.success("登录成功");
  };

  return (
    <div className="login">
      <Card className="login-container">
        {/* 登录表单 */}
        <Form validateTrigger={["onBlur"]} onFinish={onFinish}>
          <img src={title} alt="logo" className="login-title" />
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "请输入用户名" },
              {
                pattern: /^[a-zA-Z0-9]{3,16}$/,
                message: "请输入正确用户名",
              },
            ]}
          >
            <Input size="large" placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              {
                pattern: /^[a-zA-Z0-9]{6,16}$/,
                message: "请输入6-16位密码",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="请输入密码"
              minLength={6}
              maxLength={16}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
