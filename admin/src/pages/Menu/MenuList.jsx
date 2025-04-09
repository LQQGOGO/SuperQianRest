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
import {
  getMenuList,
  getCategoryList,
  addMenu,
  editMenu,
  deleteMenu,
} from "@/apis/menu";
import "./MenuList.scss";
import UploadImage from "@/components/UploadImage";
import { PlusOutlined } from "@ant-design/icons";
const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

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
  const handleEdit = (item) => {
    console.log(item);
    setFormTitle("编辑菜单");
    // 打开前重置表单
    form.resetFields();
    setOpen(true);

    // 设置表单值
    form.setFieldsValue({
      name: item.name,
      price: item.price,
      description: item.description,
      category_id: item.category_id,
      image: item.image,
    });
    setEditingMenu(item);
  };

  // 删除菜单
  const handleDelete = async (item) => {
    try {
      const res = await deleteMenu(item.id);
      if (res && res.message) {
        message.success(res.message);
        fetchMenuList(); // 删除后刷新列表
      }
    } catch (error) {
      console.error("删除失败:", error);
    }
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
  const onCreate = async (values) => {
    try {
      let res;
      if (formTitle === "添加菜品") {
        res = await addMenu(values);
      } else {
        console.log(editingMenu);
        res = await editMenu(editingMenu.id, values);
      }

      if (res && res.message) {
        message.success(res.message);
        setOpen(false);
        fetchMenuList(); // 添加或编辑用户后刷新列表
      }
    } catch (error) {
      console.error("操作失败:", error);
    }
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
              initialValues={{
                name: "",
                price: "",
                description: "",
                category_id: 1,
                image: "",
              }}
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
                pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9\s]{3,16}$/,
                message: "名称应为3-16个字符，可包含中文、字母、数字、空格",
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
              {
                pattern: /^.{5,20}$/,
                message: "描述长度应为5~20个字符",
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
              {categories.map((category) => (
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
            // 打开前重置表单
            form.resetFields();
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
