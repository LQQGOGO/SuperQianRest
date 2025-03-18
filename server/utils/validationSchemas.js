const Joi = require("joi");

// 用户相关验证
const userSchemas = {
  login: Joi.object({
    username: Joi.string().required().messages({
      "string.empty": "用户名不能为空",
      "any.required": "用户名是必填项",
    }),
    password: Joi.string().required().messages({
      "string.empty": "密码不能为空",
      "any.required": "密码是必填项",
    }),
  }),

  register: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    email: Joi.string().email().allow(""),
    phone: Joi.string().allow(""),
    role: Joi.string().valid("admin", "staff", "customer").default("customer"),
  }),

  resetPassword: Joi.object({
    username: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    resetCode: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().allow(""),
  }),

  updateProfile: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().allow(""),
    email: Joi.string().email().allow(""),
    avatar: Joi.string().allow(""),
  }),

  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),
};

// 菜单相关验证
const menuSchemas = {
  createItem: Joi.object({
    category_id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    price: Joi.number().positive().required(),
    image: Joi.string().allow(""),
    is_special: Joi.number().valid(0, 1).default(0),
    is_available: Joi.number().valid(0, 1).default(1),
  }),
};

module.exports = {
  userSchemas,
  menuSchemas,
};
