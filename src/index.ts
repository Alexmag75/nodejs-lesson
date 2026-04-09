import express, { NextFunction, Request, Response } from "express";
import { IUser } from "./interfaces/user.interface";
import { read, write } from "./fs.service";
import { ApiError } from "./errors/api-error";

const app = express();
app.use(express.json());

app.get("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await read();
    res.send(users);
  } catch (e) {
    next(e);
  }
});

app.post("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const users = await read();

    if (!name || name.length <= 3) {
      return res.status(400).send("Имя должно быть длиннее 3 символов");
    }
    const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUser: IUser = { id, name, email, password };

    users.push(newUser);
    await write(users);

    res.status(201).send(newUser);
  } catch (e) {
    next(e);
  }
});

app.get(
  "/users/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await read();
      const user = users.find((u) => u.id === Number(req.params.userId));

      if (!user) return res.status(404).send("Пользователь не найден");

      res.send(user);
    } catch (e) {
      next(e);
    }
  },
);

app.put(
  "/users/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const users = await read();
      const index = users.findIndex((u) => u.id === Number(req.params.userId));

      if (index === -1) return res.status(404).send("Пользователь не найден");

      if (name && name.length <= 3)
        return res.status(400).send("Новое имя слишком короткое");

      users[index] = {
        ...users[index],
        name: name || users[index].name,
        email: email || users[index].email,
        password: password || users[index].password,
      };

      await write(users);
      res.send(users[index]);
    } catch (e) {
      next(e);
    }
  },
);

app.delete(
  "/users/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let users = await read();
      const userId = Number(req.params.userId);

      const exists = users.some((u) => u.id === userId);
      if (!exists)
        return res.status(404).send("Некого удалять, юзер не найден");

      users = users.filter((u) => u.id !== userId);
      await write(users);

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  },
);

app.use((error: ApiError, req: Request, res: Response) => {
  res.status(error.status || 500).send(error.message);
});

process.on("uncaughtException", (error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("uncaughtException", message, error.stack);
  process.exit(1);
});
app.listen(3000, () => console.log("Server OK on port 3000"));
