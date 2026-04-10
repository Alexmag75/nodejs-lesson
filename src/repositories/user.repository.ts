import { IUser } from "../interfaces/user.interface";
import { read, write } from "../services/fs.service";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await read();
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    const users = await read();

    const newUser: IUser = {
      id: users.length ? (users[users.length - 1]?.id || 0) + 1 : 1,
      name: dto.name || "",
      email: dto.email || "",
      password: dto.password || "",
    };

    users.push(newUser);
    await write(users);
    return newUser;
  }

  public async getById(userId: number): Promise<IUser | null> {
    const users = await read();
    return users.find((user) => user.id === userId) ?? null;
  }

  public async update(
    userId: number,
    dto: Partial<IUser>,
  ): Promise<IUser | null> {
    const users = await read();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    users[index] = { ...users[index], ...dto }; // Мержим старые данные с новыми
    await write(users);
    return users[index];
  }

  public async delete(userId: number): Promise<boolean> {
    const users = await read();
    const initialLength = users.length;
    const filteredUsers = users.filter((u) => u.id !== userId);

    if (initialLength === filteredUsers.length) return false;

    await write(filteredUsers);
    return true;
  }
}
export const userRepository = new UserRepository();
