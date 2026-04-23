import { NextFunction, Request, Response } from "express";

import {
  IResetPasswordSend,
  IResetPasswordSet,
  ISignIn,
  IUser,
} from "../interfaces/user.interface";
import { authService } from "../services/auth.service";
import { ITokenPayload } from "../interfaces/token.interface";

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

  public async refresh(_req: Request, res: Response, next: NextFunction) {
    try {
      const { jwtPayload, tokenPair } = res.locals; // Берем из middleware

      const result = await authService.refresh(jwtPayload, tokenPair);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: tokenId, _userId: userId } = res.locals.tokenPair;
      const { name, email } = res.locals.user;

      await authService.logout(userId, tokenId, name, email);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async logoutAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const { _userId: userId } = res.locals.tokenPair;
      await authService.logoutAll(userId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
  public async forgotPasswordSendEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body as IResetPasswordSend;
      await authService.forgotPasswordSendEmail(dto);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPasswordSet(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const jwtPayload = res.locals.jwtPayload as ITokenPayload;
      const dto = req.body as IResetPasswordSet;

      await authService.forgotPasswordSet(dto, jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
