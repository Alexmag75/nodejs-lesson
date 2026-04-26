import { Schema, model } from "mongoose";
import { IOldPassword } from "../interfaces/old-password.interface";

const oldPasswordSchema = new Schema<IOldPassword>(
  {
    _userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    password: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
);

export const OldPassword = model<IOldPassword>(
  "OldPassword",
  oldPasswordSchema,
);
