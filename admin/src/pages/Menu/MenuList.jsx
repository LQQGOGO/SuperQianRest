import { useState, useEffect } from "react";
import { Card, message, Avatar, List } from "antd";
import ListComponent from "@/components/ListComponent";
import { getMenuList } from "@/apis/manu";
import "./MenuList.scss";

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenuList();
  }, []);

  // 获取菜单列表
  const fetchMenuList = async () => {
    setLoading(true);
    try {
      const menuList = await getMenuList();
      console.log(menuList);     
      setMenus(menuList.items);
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
  };

  // 删除菜单
  const handleDelete = (id) => {
    console.log(id);
  };

  return (
    <div className="menu-list-container">
      <Card>
        <div className="menu-list-content">
          {/* 菜单列表 */}
          <ListComponent
            dataSource={menus}
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