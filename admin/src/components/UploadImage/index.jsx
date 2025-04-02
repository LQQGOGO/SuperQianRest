import React, { useState, useEffect } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Flex, message, Upload } from "antd";
import { uploadImage } from "@/apis/upload";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("只能上传 JPG/PNG 格式的图片!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片大小不能超过 2MB!");
    return false;
  }
  return isJpgOrPng && isLt2M;
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
        // 使用我们的 API 函数上传图片
        const fileUrl = await uploadImage(info.file.originFileObj);

        setLoading(false);
        setImageUrl(fileUrl);

        // 调用 Form.Item 的 onChange 回调，将值传递给表单
        if (onChange) {
          onChange(fileUrl);
        }

        message.success("头像上传成功");
      } catch (error) {
        setLoading(false);
        // 错误已在 API 函数中处理
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
      const fileUrl = await uploadImage(file);

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
