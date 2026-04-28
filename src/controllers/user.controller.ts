import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";
import { ITokenPayload } from "../interfaces/token.interface";
import { UploadedFile } from "express-fileupload";
import { userPresenter } from "../presenters/user.presenter";

class UserController {
  public async getList(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getList();
      const result = users.map((user) => userPresenter.toPublicResDto(user));
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId as string;
      const user = await userService.getById(userId);
      const result = userPresenter.toPublicResDto(user);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
  public async getMe(_req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = res.locals.jwtPayload as ITokenPayload;

      const user = await userService.getMe(jwtPayload);
      const result = userPresenter.toPublicResDto(user);
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
  public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res?.locals.jwtPayload as ITokenPayload;

      if (!req.files || !req.files.avatar) {
        throw new Error("No file uploaded");
      }

      const avatar = req.files.avatar as UploadedFile;
      const user = await userService.uploadAvatar(jwtPayload, avatar);

      const result = userPresenter.toPublicResDto(user);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
  public async deleteAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = res.locals.jwtPayload as ITokenPayload;

      const user = await userService.deleteAvatar(jwtPayload);
      const result = userPresenter.toPublicResDto(user);

      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
