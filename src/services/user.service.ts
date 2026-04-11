import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    if (!dto.name || dto.name.length < 3) {
      throw new ApiError("Имя должно быть длиннее 3 символов", 400);
    }
    if (!dto.email || !dto.email.includes("@")) {
      throw new ApiError(
        "Адрес электронной почты обязателен и должен существовать",
        400,
      );
    }
    if (!dto.password || dto.password.length < 6) {
      throw new ApiError(
        "Длина пароля должна составлять не менее 6 символов.",
        400,
      );
    }
    return await userRepository.create(dto);
  }

  public async getById(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("Пользователь не найден", 404);
    }
    return user;
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    if (dto.name && dto.name.length < 3) {
      throw new ApiError("Новое имя слишком короткое", 400);
    }
    if (dto.email && !dto.email.includes("@")) {
      throw new ApiError("Некорректный формат email", 400);
    }
    const updatedUser = await userRepository.updateById(userId, dto as IUser);
    if (!updatedUser) {
      throw new ApiError("Пользователь не найден", 404);
    }

    return updatedUser;
  }

  public async deleteById(userId: string): Promise<IUser> {
    const deletedUser = await userRepository.deleteById(userId);

    if (!deletedUser) {
      throw new ApiError("Некого удалять, юзер не найден", 404);
    }

    return deletedUser;
  }
}

export const userService = new UserService();
