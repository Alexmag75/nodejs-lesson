import { Router } from "express";

import { userController } from "../controllers/user.controller";

import { UserValidator } from "../validators/user.validator";
import { authMiddleware } from "../middleware/auth.middleware";
import { commonMiddleware } from "../middleware/CommonMiddleware";
import { fileMiddleware } from "../middleware/file.middleware";

const router = Router();

router.get(
  "/",
  commonMiddleware.isQueryValid(UserValidator.listQuery),
  userController.getList,
);

router.get("/me", authMiddleware.checkAccessToken, userController.getMe);
router.put(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateMe,
);
router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);
router.post(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  fileMiddleware.isFileValid(),
  userController.uploadAvatar,
);
router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getById,
);

export const userRouter = router;
