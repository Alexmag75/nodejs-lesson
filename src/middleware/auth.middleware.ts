import { NextFunction, Request, Response } from "express";

import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";
import { userRepository } from "../repositories/user.repository";
import { IResetPasswordSet } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const header = req.headers.authorization;
    if (!header) {
      return next(new ApiError("Token отсутствует", 401));
    }

    try {
      const accessToken = header.split("Bearer ")[1];
      const payload = tokenService.verifyToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );

      const pair = await tokenRepository.findByParams({ accessToken });
      if (!pair) {
        return next(new ApiError("Токен недействителен", 401));
      }
      const user = await userRepository.getById(payload.userId);
      if (!user) {
        return next(new ApiError("User not found", 404));
      }

      res.locals.user = user;
      res.locals.tokenPair = pair;
      res.locals.jwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new ApiError("Refresh token отсутствует", 401));
    }

    try {
      const payload = tokenService.verifyToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

      const pair = await tokenRepository.findByParams({ refreshToken });
      if (!pair) {
        return next(
          new ApiError("Refresh токен недействителен или отозван", 401),
        );
      }
      const user = await userRepository.getById(payload.userId);
      if (!user) {
        return next(new ApiError("Пользователь не найден", 404));
      }
      res.locals.user = user;
      res.locals.jwtPayload = payload;
      res.locals.tokenPair = pair;

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkActionToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { token } = req.body as IResetPasswordSet;
    if (!token) {
      return next(new ApiError("Token is required", 400));
    }

    try {
      const payload = tokenService.verifyToken(
        token,
        ActionTokenTypeEnum.FORGOT_PASSWORD,
      );

      const tokenEntity = await actionTokenRepository.getByToken(token);
      if (!tokenEntity) {
        return next(new ApiError("Token is not valid or already used", 401));
      }

      res.locals.jwtPayload = payload;
      res.locals.tokenEntity = tokenEntity;

      next();
    } catch (e) {
      next(e);
    }
  }
}
export const authMiddleware = new AuthMiddleware();
