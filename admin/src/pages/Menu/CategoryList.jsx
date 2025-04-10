import {
  Card,
  List,
  Image,
  Modal,
  Button,
  Form,
  Input,
  message,
  Popconfirm,
} from "antd";
import Icon, { EditOutlined } from "@ant-design/icons";
import UploadImage from "@/components/UploadImage";
import {
  getCategoryList,
  addCategory,
  getMenuList,
  deleteCategory,
  editCategory,
} from "@/apis/menu";
import { useEffect, useState } from "react";
import DeleteSvg from "@/assets/Icons/Delete.svg?react";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [title, setTitle] = useState("添加菜品种类");
  const [editingCategory, setEditingCategory] = useState(null);

  // 获取种类列表
  const fetchCategoryList = async () => {
    const res = await getCategoryList();
    setCategories(res.items);
  };

  // 添加种类
  const onCreate = async (values) => {
    try {
      let res;
      if (title === "添加菜品种类") {
        res = await addCategory(values);
      } else {
        res = await editCategory(editingCategory.id, values);
      }

      if (res && res.message) {
        message.success(res.message);
        setOpen(false);
        fetchCategoryList(); // 添加或编辑后刷新列表
      }
    } catch (error) {
      console.error("操作失败:", error);
    }
    
  };

  //删除种类
  const handleDelete = async (item) => {
    const list = await getMenuList({
      category_id: item.id,
    });
    if (list.items.length > 0) {
      message.error("该种类下有菜品，不能删除");
      return;
    }
    const res = await deleteCategory(item.id);
    message.success(res.message || "删除成功");
    fetchCategoryList();
  };

  // 编辑种类
  const handleEdit = (item) => {
    setTitle("编辑菜品种类");
    setOpen(true);
    form.setFieldsValue({
      name: item.name,
      description: item.description,
      image: item.image,
    });
    setEditingCategory(item);
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  return (
    <div className="category-list-container">
      <Card>
        {/* 种类表单*/}
        <Modal
          open={open}
          title={title}
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
              name="category_form"
              initialValues={{
                name: "",
                description: "",
                image: "",
              }}
              onFinish={(values) => onCreate(values)}
              preserve={false}
            >
              {dom}
            </Form>
          )}
        >
          {/* 种类名称 */}
          <Form.Item
            name="name"
            label="种类名称"
            rules={[
              {
                required: true,
                message: "请输入种类名称",
              },
              {
                pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9\s]{2,10}$/,
                message: "种类名应为2-10个字符，可包含中文、字母、数字、空格",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* 种类描述 */}
          <Form.Item
            name="description"
            label="种类描述"
            rules={[
              {
                required: true,
                message: "请输入种类描述",
              },
              {
                pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9\s]{3,16}$/,
                message: "种类描述应为3-16个字符，可包含中文、字母、数字、空格",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* 种类图片 */}
          <Form.Item
            name="image"
            label="种类图片"
            rules={[
              {
                required: true,
                message: "请上传种类图片",
              },
            ]}
          >
            <UploadImage />
          </Form.Item>
        </Modal>

        {/* 添加种类按钮 */}
        <Button
          type="primary"
          onClick={() => {
            // 打开前重置表单
            form.resetFields();
            setTitle("添加菜品种类");
            setOpen(true);
          }}
        >
          添加菜品种类
        </Button>

        {/* 种类列表 */}
        <List
          itemLayout="vertical"
          dataSource={categories}
          renderItem={(item) => (
            <List.Item
              actions={[
                // 编辑种类
                <Button block shape="circle" color="primary" onClick={() => handleEdit(item)}>
                  <Icon component={EditOutlined} />
                </Button>,
                // 删除种类
                <Popconfirm
                  key="list-loadmore-delete"
                  title="删除"
                  description={`确定要删除 "${item.name}" 吗？`}
                  onConfirm={() => handleDelete(item)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button block shape="circle" color="primary">
                    <Icon component={DeleteSvg} />
                  </Button>
                </Popconfirm>,
              ]}
              extra={
                <Image
                  width={120}
                  height={120}
                  alt="logo"
                  src="error"
                  fallback={item.image}
                />
              }
            >
              <List.Item.Meta
                title={item.name}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default CategoryList;
