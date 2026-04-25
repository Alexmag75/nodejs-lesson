import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return User.find({});
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
