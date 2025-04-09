import { useState, useEffect } from "react";
import {
  Card,
  message,
  Avatar,
  List,
  Modal,
  Form,
  Input,
  Radio,
  Button,
  Tabs,
} from "antd";
import ListComponent from "@/components/ListComponent";
import { getMenuList, getCategoryList } from "@/apis/menu";
import "./MenuList.scss";
import UploadImage from "@/components/UploadImage";
import { PlusOutlined } from "@ant-design/icons";
const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [activeCategory, setActiveCategory] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenuList();
  }, []);

  // 获取菜单列表和种类
  const fetchMenuList = async () => {
    setLoading(true);
    try {
      const menuList = await getMenuList();
      const categoryList = await getCategoryList();
      // setActiveCategory(sessionStorage.getItem("activeCategory") || 1);
      // 根据分类过滤菜单
      const filtered = menuList.items.filter(
        (menu) => menu.category_id === activeCategory
      );
      setMenus(menuList.items);
      setCategories(categoryList.items);
      setFilteredMenus(filtered);
      setLoading(false);
    } catch (error) {
      console.error("获取菜单列表失败:", error);
      message.error("获取菜单列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 编辑菜单
  const handleEdit = (id) => {
    console.log(id);
    setFormTitle("编辑菜单");
    setOpen(true);
  };

  // 删除菜单
  const handleDelete = (id) => {
    console.log(id);
  };

  // 根据分类过滤菜单
  const filterMenusByCategory = (categoryId) => {
    const filtered = menus.filter((menu) => menu.category_id === categoryId);
    setFilteredMenus(filtered);
  };

  // 菜单表单
  const [open, setOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("编辑菜单");
  const [form] = Form.useForm();

  // 创建菜单
  const onCreate = (values) => {
    console.log(values);
  };

  return (
    <div className="menu-list-container">
      <Card>
        {/* 菜单表单*/}
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
              name="menu_form"
              initialValues={{}}
              onFinish={(values) => onCreate(values)}
              preserve={false}
            >
              {dom}
            </Form>
          )}
        >
          {/* 菜单名称 */}
          <Form.Item
            name="name"
            label="菜品名称"
            rules={[
              {
                required: true,
                message: "请输入菜品名称",
              },
              {
                pattern: /^.{3,16}$/,
                message: "长度应在3-16位",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* 菜品价格 */}
          <Form.Item
            name="price"
            label="菜品价格"
            rules={[
              { required: true, message: "请输入菜品价格" },
              {
                pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
                message: "请输入正确价格",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* 菜品描述 */}
          <Form.Item
            name="description"
            label="菜品描述"
            rules={[
              {
                required: true,
                message: "请输入菜品描述",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* 菜品分类 */}
          <Form.Item
            name="category_id"
            label="菜品分类"
            rules={[
              {
                required: true,
                message: "请选择菜品分类",
              },
            ]}
          >
            <Radio.Group>
              {filteredMenus.map((category) => (
                <Radio key={category.id} value={category.id}>
                  {category.name}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          {/* 菜品图片 */}
          <Form.Item
            name="image"
            label="菜品图片"
            rules={[
              {
                required: true,
                message: "请上传菜品图片",
              },
            ]}
          >
            <UploadImage />
          </Form.Item>
        </Modal>
        {/* 添加菜品按钮 */}
        <Button
          type="primary"
          onClick={() => {
            setFormTitle("添加菜品");
            setOpen(true);
          }}
        >
          添加菜品
        </Button>
        {/* 菜品分类 */}
        <Tabs
          activeKey={activeCategory}
          items={categories.map((category) => ({
            label: category.name,
            key: category.id,
          }))}
          onChange={(key) => {
            setActiveCategory(key);
            // sessionStorage.setItem("activeCategory", key);
            filterMenusByCategory(key);
          }}
          tabBarExtraContent={{
            right: (
              <Button type="default" size="small" onClick={() => {}}>
                <PlusOutlined />
              </Button>
            ),
          }}
        />
        <div className="menu-list-content">
          {/* 菜单列表 */}
          <ListComponent
            dataSource={filteredMenus}
            loading={loading}
            pagination={{
              position: "bottom",
              align: "center",
              pageSize: 5,
            }}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            renderItemContent={(item) => (
              <List.Item.Meta
                avatar={<Avatar shape="square" size={80} src={item.image} />}
                title={
                  <div>
                    {item.name} ￥{item.price}
                  </div>
                }
                description={item.description}
              />
            )}
          />
        </div>
      </Card>
    </div>
  );
};

export default MenuList;
