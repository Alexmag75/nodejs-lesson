import { NextFunction, Request, Response } from "express";

import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";
import { userRepository } from "../repositories/user.repository";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("Token отсутствует", 401);
      }
      const accessToken = header.split("Bearer ")[1];
      const payload = tokenService.verifyToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );

      const pair = await tokenRepository.findByParams({ accessToken });
      if (!pair) {
        throw new ApiError("Токен недействителен", 401);
      }
      const user = await userRepository.getById(payload.userId);
      if (!user) throw new ApiError("User not found", 404);

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
  ) {
    try {
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        throw new ApiError("Refresh token отсутствует", 401);
      }

      const payload = tokenService.verifyToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

      const pair = await tokenRepository.findByParams({ refreshToken });
      if (!pair) {
        throw new ApiError("Refresh токен недействителен или отозван", 401);
      }
      const user = await userRepository.getById(payload.userId);
      if (!user) {
        throw new ApiError("Пользователь не найден", 404);
      }
      res.locals.user = user;
      res.locals.jwtPayload = payload;
      res.locals.tokenPair = pair;

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
