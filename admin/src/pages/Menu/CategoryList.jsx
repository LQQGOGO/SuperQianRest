import { Card, List, Image } from "antd";
import { getCategoryList } from "@/apis/menu";
import { useEffect, useState } from "react";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  // 获取种类列表
  const fetchCategoryList = async () => {
    const res = await getCategoryList();
    setCategories(res.items); 
  };


  useEffect(() => {
    fetchCategoryList();
  }, []);

  return (
    <div className="category-list-container">
      <Card>
        <List
          itemLayout="vertical"
          dataSource={categories}
          renderItem={(item) => (
            <List.Item
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
