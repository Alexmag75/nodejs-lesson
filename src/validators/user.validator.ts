import Joi from "joi";
import { RoleEnum } from "../enums/role.enum";

export const UserValidator = {
  create: Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    age: Joi.number().min(1).max(120).required(),
    phone: Joi.string().optional(),
    role: Joi.string()
      .valid(...Object.values(RoleEnum))
      .optional(),
  }),
  signIn: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  update: Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    age: Joi.number().min(1).max(120).optional(),
  }),
  id: Joi.object({
    userId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid Object ID",
      }),
  }),
  changePassword: Joi.object({
    oldPassword: Joi.string().required().messages({
      "any.required": "Old password is required",
    }),
    password: Joi.string().min(8).max(30).required().messages({
      "string.min": "New password must be at least 8 characters long",
      "any.required": "New password is required.",
    }),
  }),
};
