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

  public async getById(userId: number): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("Пользователь не найден", 404);
    }
    return user;
  }

  public async update(userId: number, dto: Partial<IUser>): Promise<IUser> {
    // Валидация имени, если оно пришло
    if (dto.name && dto.name.length < 3) {
      throw new ApiError("Новое имя слишком короткое", 400);
    }

    const updatedUser = await userRepository.update(userId, dto);
    if (!updatedUser) {
      throw new ApiError("Пользователь не найден", 404);
    }
    return updatedUser;
  }

  public async delete(userId: number): Promise<void> {
    const isDeleted = await userRepository.delete(userId);
    if (!isDeleted) {
      throw new ApiError("Некого удалять, юзер не найден", 404);
    }
  }
}

export const userService = new UserService();
