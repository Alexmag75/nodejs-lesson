import { NextFunction, Request, Response } from "express";

import { ISignIn, IUser } from "../interfaces/user.interface";
import { authService } from "../services/auth.service";

class AuthController {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as IUser;
      const result = await authService.signUp(dto);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as ISignIn;
      const result = await authService.signIn(dto);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { jwtPayload, tokenPair } = res.locals; // Берем из middleware

      const result = await authService.refresh(jwtPayload, tokenPair);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: tokenId, _userId: userId } = res.locals.tokenPair;
      const { name, email } = res.locals.user;

      await authService.logout(userId, tokenId, name, email);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { _userId: userId } = res.locals.tokenPair;
      await authService.logoutAll(userId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
