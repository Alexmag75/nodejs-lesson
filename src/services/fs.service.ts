import fs from "node:fs/promises";
import path from "node:path";
import { IUser } from "../interfaces/user.interface";

const pathToFile = path.join(process.cwd(), "db.json");

const read = async (): Promise<IUser[]> => {
  try {
    const data = await fs.readFile(pathToFile, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    if ((e as any).code === "ENOENT") {
      return [];
    }
    const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
    console.error("Ошибка чтения:", errorMessage);
    return [];
  }
};

const write = async (users: IUser[]): Promise<void> => {
  try {
    await fs.writeFile(pathToFile, JSON.stringify(users, null, 2));
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
    console.error("Ошибка записи:", errorMessage);
  }
};

export { read, write };
