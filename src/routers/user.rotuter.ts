import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middleware/CommonMiddleware";

const router = Router();

router.get("/", userController.getList);
router.post("/", userController.create);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getById,
);
router.put(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.updateById,
);
router.delete(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.deleteById,
);

export const userRouter = router;
