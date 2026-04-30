import { QueryFilter } from "mongoose";
import { IUser, IUserListQuery } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getList(query: IUserListQuery): Promise<[IUser[], number]> {
    const filterObj: QueryFilter<IUser> = { isVerified: true };
    if (query.search) {
      filterObj.name = { $regex: query.search, $options: "i" };
    }

    const sortObj: { [key: string]: any } = {};

    if (query.orderBy && query.order) {
      sortObj[query.orderBy] = query.order;
    } else {
      sortObj.createdAt = "desc";
    }
    const limit = query.limit ?? 10;
    const skip = query.limit! * (query.page! - 1);

    return await Promise.all([
      User.find(filterObj).sort(sortObj).limit(limit!).skip(skip),
      User.countDocuments(filterObj),
    ]);
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }

  public async getById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select("+password");
  }
  public async getByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).select("+password");
  }
  public async updateById(
    userId: string,
    dto: Partial<IUser>,
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, dto, { new: true });
  }

  public async deleteById(userId: string): Promise<IUser | null> {
    return User.findByIdAndDelete(userId);
  }
}

export const userRepository = new UserRepository();
