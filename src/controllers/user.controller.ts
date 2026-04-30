import { NextFunction, Request, Response } from "express";
import { IUser, IUserListQuery } from "../interfaces/user.interface";
import { userService } from "../services/user.service";
import { ITokenPayload } from "../interfaces/token.interface";
import { UploadedFile } from "express-fileupload";
import { userPresenter } from "../presenters/user.presenter";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as IUserListQuery;
      const result = await userService.getList(query);
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
}

export const userController = new UserController();
