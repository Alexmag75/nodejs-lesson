import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";
import { ITokenPayload } from "../interfaces/token.interface";

class UserController {
  public async getList(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getList();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const result = await userService.getById(userId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
  public async getMe(_req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = res.locals.jwtPayload as ITokenPayload;

      const result = await userService.getMe(jwtPayload);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = res.locals.jwtPayload as ITokenPayload;
      const dto = req.body as IUser;

      const result = await userService.updateMe(jwtPayload, dto);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteMe(_req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = res.locals.jwtPayload as ITokenPayload;
      await userService.deleteMe(jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
