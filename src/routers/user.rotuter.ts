import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { UserValidator } from "../validators/user.validator";
import { userMiddleware } from "../middleware/user.middleware";
import { commonMiddleware } from "../middleware/CommonMiddleware";

const router = Router();

router.get("/", userController.getList);

router.post(
  "/",
  userMiddleware.validateBody(UserValidator.create),
  userController.create,
);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userMiddleware.validateParams(UserValidator.id),
  userController.getById,
);

router.put(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userMiddleware.validateParams(UserValidator.id),
  userMiddleware.validateBody(UserValidator.update),
  userController.updateById,
);

router.delete(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userMiddleware.validateParams(UserValidator.id),
  userController.deleteById,
);

export const userRouter = router;
