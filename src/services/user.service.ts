import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { ITokenPayload } from "../interfaces/token.interface";
import { UploadedFile } from "express-fileupload";
import { s3Service } from "./s3.service";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";

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
      throw new ApiError("Пользователь не найден", 404);
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
      throw new ApiError("Пользователь не найден", 404);
    }

    return updatedUser;
  }

  public async deleteMe(jwtPayload: ITokenPayload): Promise<void> {
    const deletedUser = await userRepository.deleteById(jwtPayload.userId);

    if (!deletedUser) {
      throw new ApiError("Пользователь не найден", 404);
    }
  }
  public async uploadAvatar(
    jwtPayload: ITokenPayload,
    file: UploadedFile,
  ): Promise<IUser> {
    const user = await userRepository.getById(jwtPayload.userId);

    if (!user || !user._id) {
      throw new ApiError("User or User ID not found", 404);
    }

    const userIdString = user._id.toString();

    const avatar = await s3Service.uploadFile(
      file,
      FileItemTypeEnum.USER,
      userIdString,
    );

    const updatedUser = await userRepository.updateById(userIdString, {
      avatar,
    });

    if (!updatedUser) {
      throw new ApiError("Update failed", 500);
    }

    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    return updatedUser;
  }

  public async deleteAvatar(jwtPayload: ITokenPayload): Promise<IUser> {
    const user = await userRepository.getById(jwtPayload.userId);

    if (!user || !user._id) {
      throw new ApiError("Пользователь не найден", 404);
    }

    if (!user.avatar) {
      throw new ApiError("У пользователя нет аватара", 400);
    }

    await s3Service.deleteFile(user.avatar);

    const updatedUser = await userRepository.updateById(user._id.toString(), {
      avatar: undefined,
    });

    if (!updatedUser) {
      throw new ApiError("Ошибка при обновлении пользователя", 500);
    }

    return updatedUser;
  }
}

export const userService = new UserService();
