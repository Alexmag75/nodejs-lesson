import express, { Request, Response } from "express";
import { ApiError } from "./errors/api-error";
import { userRouter } from "./routers/user.rotuter";
import { configs } from "./config/configs";
import * as mongoose from "mongoose";

const app = express();
app.use(express.json());

app.use("/users", userRouter);

app.use((error: ApiError, req: Request, res: Response) => {
  res.status(error.status || 500).send(error.message);
});

process.on("uncaughtException", (error: Error) => {
  console.error("uncaughtException", error.message, error.stack);
  process.exit(1);
});
app.listen(configs.APP_PORT, async () => {
  try {
    await mongoose.connect(configs.MONGO_URI!);
    console.log("Подключено к MongoDB");
    console.log(
      `Сервер работает на http://${configs.APP_HOST}:${configs.APP_PORT}`,
    );
  } catch (error) {
    console.error("Не удалось установить соединение с базой данных.:", error);
    process.exit(1);
  }
});
