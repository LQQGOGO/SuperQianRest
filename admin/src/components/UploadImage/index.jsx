import React, { useState, useEffect } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Flex, message, Upload } from "antd";
import { uploadImage } from "@/apis/upload";

const beforeUpload = (file) => {
  // 根据后端接口支持的格式扩展验证
  const isValidFormat = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ].includes(file.type);
  if (!isValidFormat) {
    message.error("只能上传 JPG/PNG/GIF/WEBP 格式的图片!");
    return false;
  }
  // 根据后端接口调整大小限制为 5MB
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error("图片大小不能超过 5MB!");
    return false;
  }
  return isValidFormat && isLt5M;
};

const UploadImage = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(value);

  // 当外部 value 变化时更新内部状态
  useEffect(() => {
    setImageUrl(value);
  }, [value]);

  const handleChange = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      try {

        setLoading(false);
        setImageUrl(info.file.response.fileUrl);

        // 调用 Form.Item 的 onChange 回调，将值传递给表单
        if (onChange) {
          onChange(info.file.response.fileUrl);
        }

        message.success("头像上传成功");
      } catch (error) {
        setLoading(false);
        // 错误已在 API 函数中处理
        console.error("上传失败:", error);
      }
    }

    if (info.file.status === "error") {
      setLoading(false);
      message.error("上传失败，请重试");
    }
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      // 手动上传文件
      console.log("customRequest开始");
      const fileUrl = await uploadImage(file);
      console.log("customRequest结束");

      // 调用成功回调
      onSuccess({ fileUrl }, new XMLHttpRequest());
    } catch (error) {
      // 调用错误回调
      onError(error);
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传头像
      </div>
    </button>
  );

  return (
    <Flex gap="middle" wrap>
      <Upload
        name="image"
        listType="picture-circle"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        customRequest={customRequest} // 使用自定义上传方法
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </Flex>
  );
};

export default UploadImage;
