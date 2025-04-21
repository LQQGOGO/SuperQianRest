import { getShopInfo, updateShopInfo } from "../../apis/setting";
import { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Image,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  TimePicker,
  message,
} from "antd";
import UploadImage from "../../components/UploadImage";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;

const BasicInfo = () => {
  const [shopInfo, setShopInfo] = useState(null);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [businessHours, setBusinessHours] = useState([]);
  const [countdown, setCountdown] = useState(0);

  // 获取店铺信息
  const fetchShopInfo = async () => {
    const res = await getShopInfo();
    setShopInfo(res);

    // 提取时间部分
    const timeRange = res.business_hours.match(/\d{2}:\d{2}/g);

    // 转换为 dayjs 对象
    const timeRangeDayjs = timeRange.map((t) => dayjs(t, "HH:mm")); // [dayjs("10:00"), dayjs("22:00")]
    setBusinessHours(timeRangeDayjs);
  };

  useEffect(() => {
    fetchShopInfo();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

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

  // 修改店铺信息
  const onCreate = async (values) => {
    const [startTime, endTime] = values.business_hours;
    const formatted = `周一至周日 ${startTime.format("HH:mm")}-${endTime.format(
      "HH:mm"
    )}`;
    const params = {
      ...values,
      business_hours: formatted,
    };
    const res = await updateShopInfo(params);
    message.success(res.message);
    setOpen(false);
    setCountdown(60);
    fetchShopInfo();
  };

  return (
    // <div className="basic-info-container">
    //   {shopInfo && (
    //     <Card title="店铺信息">
    //       <Avatar src={shopInfo.logo} size={100} />
    //       <div className="shop-info-content">
    //         <div className="shop-info-item">
    //           <span className="shop-info-label">店铺名称：</span>
    //           <span className="shop-info-value">{shopInfo.shop_name}</span>
    //         </div>
    //         <div className="shop-info-item">
    //           <span className="shop-info-label">📍 店铺地址：</span>
    //           <span className="shop-info-value">{shopInfo.address}</span>
    //         </div>
    //         <div className="shop-info-item">
    //           <span className="shop-info-label">📞 店铺电话：</span>
    //           <span className="shop-info-value">{shopInfo.phone}</span>
    //         </div>
    //         <div className="shop-info-item">
    //           <span className="shop-info-label">📧 店铺邮箱：</span>
    //           <span className="shop-info-value">{shopInfo.email}</span>
    //         </div>
    //       </div>
    //     </Card>
    //   )}
    // </div>
    <div className="basic-info-container">
      {shopInfo && (
        <Card
          title={<Title level={3}>{shopInfo.shop_name}</Title>}
          style={{ maxWidth: 800, margin: "auto" }}
        >
          {/* 店铺logo */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Image width={150} src={shopInfo.logo} alt="店铺Logo" />
          </div>

          {/* 店铺描述 */}
          <Paragraph style={{ fontSize: 18, color: "#567" }}>
            {shopInfo.description}
          </Paragraph>

          {/* 店铺信息 */}
          <Descriptions
            title="店铺信息"
            column={1}
            bordered
            size="middle"
            styles={{ label: { width: 120 } }}
          >
            <Descriptions.Item label="地址">
              <Text>{shopInfo.address}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="营业时间">
              <Text>{shopInfo.business_hours}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="电话">
              <Text>{shopInfo.phone}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              <Text>{shopInfo.email}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              <Text type="secondary">{formatDate(shopInfo.updated_at)}</Text>
            </Descriptions.Item>
          </Descriptions>

          {/* 修改按钮 */}
          <Button
            type="primary"
            style={{ marginTop: 30 }}
            disabled={countdown > 0}
            onClick={() => {
              setOpen(true);
              form.setFieldsValue({
                shop_name: shopInfo.shop_name,
                logo: shopInfo.logo,
                description: shopInfo.description,
                address: shopInfo.address,
                phone: shopInfo.phone,
                email: shopInfo.email,
                business_hours: businessHours,
              });
            }}
          >
            {countdown > 0 ? `${countdown}秒后可修改` : "修改店铺信息"}
          </Button>
        </Card>
      )}

      {/* 修改店铺信息弹窗 */}
      <Modal
        open={open}
        title="修改店铺信息"
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
            name="shop_form"
            onFinish={(values) => onCreate(values)}
            preserve={false}
          >
            {dom}
          </Form>
        )}
      >
        {/* 店铺名称 */}
        <Form.Item
          name="shop_name"
          label="店铺名称"
          rules={[
            {
              required: true,
              message: "请输入店铺名称",
            },
            {
              pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{3,16}$/,
              message: "应为长度在3-16位字符的店铺名称",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* 店铺logo */}
        <Form.Item
          name="logo"
          label="店铺logo"
          rules={[
            {
              required: true,
              message: "请上传店铺logo",
            },
          ]}
        >
          <UploadImage />
        </Form.Item>
        {/* 店铺描述 */}
        <Form.Item
          name="description"
          label="店铺描述"
          rules={[
            { required: true, message: "请输入店铺描述" },
            {
              pattern: /^.{3,60}$/,
              message: "长度在60字以内",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        {/* 店铺地址 */}
        <Form.Item
          name="address"
          label="店铺地址"
          rules={[
            { required: true, message: "请输入店铺地址" },
            {
              pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{3,20}$/,
              message: "长度应在20字以内",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* 店铺营业时间 */}
        <Form.Item
          name="business_hours"
          label="店铺营业时间"
          rules={[{ required: true, message: "请选择店铺营业时间" }]}
        >
          <TimePicker.RangePicker format="HH:mm" />
        </Form.Item>
        {/* 店铺电话 */}
        <Form.Item
          name="phone"
          label="店铺电话"
          rules={[
            { required: true, message: "请输入店铺电话" },
            {
              pattern: /^[0-9]{11}$/,
              message: "输入正确的电话号码",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* 店铺邮箱 */}
        <Form.Item
          name="email"
          label="店铺邮箱"
          rules={[
            { required: true, message: "请输入店铺邮箱" },
            {
              pattern:
                /^[a-zA-Z0-9_-]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
              message: "输入正确的邮箱",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default BasicInfo;
