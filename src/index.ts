import dotenv from "dotenv";
import fileUpload from "express-fileupload";
dotenv.config();
import swaggerUi from "swagger-ui-express";

import swaggerDocument from "../docs/swagger.json";
import express, { NextFunction, Request, Response } from "express";
import { ApiError } from "./errors/api-error";
import { userRouter } from "./routers/user.router";
import { configs } from "./config/configs";
import * as mongoose from "mongoose";
import { authRouter } from "./routers/auth.router";
import { cronRunner } from "./crons";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use((err: ApiError, _req: Request, res: Response) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
  });
});
app.use("/auth", authRouter);
app.use("/users", userRouter);

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
    cronRunner();
  } catch (error) {
    console.error("Не удалось установить соединение с базой данных.:", error);
    process.exit(1);
  }
});
