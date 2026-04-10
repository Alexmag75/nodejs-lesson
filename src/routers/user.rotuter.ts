import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getList);
router.post("/", userController.create);

router.get("/:userId", userController.getById);
router.put("/:userId", userController.update);
router.delete("/:userId", userController.delete);

export const userRouter = router;
