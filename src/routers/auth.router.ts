import { Router } from "express";

import { UserValidator } from "../validators/user.validator";
import { commonMiddleware } from "../middleware/CommonMiddleware";
import { authController } from "../controllers/auth.controller";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isBodyValid(UserValidator.create),
  authController.signUp,
);
router.post(
  "/sign-in",
  // commonMiddleware.isBodyValid(UserValidator.signIn),
  authController.signIn,
);

//TODO add refresh token route

export const authRouter = router;
