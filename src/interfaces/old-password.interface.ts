import { Types } from "mongoose";
export interface IOldPassword {
  _id?: string;
  _userId: Types.ObjectId | string;
  password: string;
  createdAt: Date;
}
