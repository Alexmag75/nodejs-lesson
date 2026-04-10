import express, { Request, Response } from "express";
import { ApiError } from "./errors/api-error";
import { userRouter } from "./routers/user.rotuter";

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
app.listen(3000, () => console.log("Server OK on port 3000"));
