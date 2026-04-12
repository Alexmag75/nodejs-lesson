import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { ITokenPayload } from "../interfaces/token.interface";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async getById(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("Пользователь не найден", 404);
    }
    return user;
  }

  public async getMe(jwtPayload: ITokenPayload): Promise<IUser> {
    const user = await userRepository.getById(jwtPayload.userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  public async updateMe(
    jwtPayload: ITokenPayload,
    dto: Partial<IUser>,
  ): Promise<IUser> {
    const updatedUser = await userRepository.updateById(
      jwtPayload.userId,
      dto as IUser,
    );

    if (!updatedUser) {
      throw new ApiError("User not found", 404);
    }

    return updatedUser;
  }

  public async deleteMe(jwtPayload: ITokenPayload): Promise<void> {
    const deletedUser = await userRepository.deleteById(jwtPayload.userId);

    if (!deletedUser) {
      throw new ApiError("User not found", 404);
    }
  }
}

export const userService = new UserService();
