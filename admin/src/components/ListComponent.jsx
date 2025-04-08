import { List, Empty, Popconfirm } from "antd";

const ListComponent = ({
  loading,
  pagination,
  dataSource,
  handleEdit,
  handleDelete,
  renderItemContent,
}) => {
  return (
    <List
      loading={loading}
      pagination={pagination}
      style={{
        height: "650px",
      }}
      dataSource={dataSource}
      locale={{ emptyText: <Empty description="暂无用户数据" /> }}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a key="list-loadmore-edit" onClick={() => handleEdit(item)}>
              编辑
            </a>,
            <Popconfirm
              key="list-loadmore-delete"
              title="删除"
              description={`确定要删除 "${item.name}" 吗？`}
              onConfirm={() => handleDelete(item)}
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>,
          ]}
        >
          {/* <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={item.name}
            description={item.email}
          /> */}
          {renderItemContent ? renderItemContent(item) : null}
        </List.Item>
      )}
    />
  );
};

export default ListComponent;
