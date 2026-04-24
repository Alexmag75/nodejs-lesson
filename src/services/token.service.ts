import * as jsonwebtoken from "jsonwebtoken";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { configs } from "../config/configs";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";

class TokenService {
  public generateTokens(payload: ITokenPayload): ITokenPair {
    const accessOptions: jsonwebtoken.SignOptions = {
      expiresIn: configs.JWT_ACCESS_EXPIRATION as any,
    };

    const refreshOptions: jsonwebtoken.SignOptions = {
      expiresIn: configs.JWT_REFRESH_EXPIRATION as any,
    };

    const accessToken = jsonwebtoken.sign(
      payload,
      configs.JWT_ACCESS_SECRET,
      accessOptions,
    );

    const refreshToken = jsonwebtoken.sign(
      payload,
      configs.JWT_REFRESH_SECRET,
      refreshOptions,
    );

    return { accessToken, refreshToken };
  }

  public verifyToken(
    token: string,
    type: TokenTypeEnum | ActionTokenTypeEnum, // Расширяем принимаемые типы
  ): ITokenPayload {
    try {
      let secret: string;
      switch (type) {
        case TokenTypeEnum.ACCESS:
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case TokenTypeEnum.REFRESH:
          secret = configs.JWT_REFRESH_SECRET;
          break;
        case ActionTokenTypeEnum.FORGOT_PASSWORD:
          secret = configs.ACTION_FORGOT_PASSWORD_SECRET!;
          break;
        case ActionTokenTypeEnum.VERIFY_EMAIL:
          secret = configs.JWT_VERIFY_EMAIL_SECRET;
          break;
        default:
          throw new ApiError("Unsupported token type", 400);
      }

      return jsonwebtoken.verify(token, secret) as ITokenPayload;
    } catch {
      throw new ApiError("Invalid token", 401);
    }
  }
  public generateActionTokens(
    payload: ITokenPayload,
    tokenType: ActionTokenTypeEnum,
  ): string {
    let secret: string;
    let expiresIn: string;

    switch (tokenType) {
      case ActionTokenTypeEnum.FORGOT_PASSWORD:
        secret = configs.ACTION_FORGOT_PASSWORD_SECRET!;
        expiresIn = configs.ACTION_FORGOT_PASSWORD_EXPIRATION!;
        break;
      case ActionTokenTypeEnum.VERIFY_EMAIL:
        secret = configs.JWT_VERIFY_EMAIL_SECRET;
        expiresIn = configs.JWT_VERIFY_EMAIL_EXPIRATION;
        break;
      default:
        throw new ApiError("Invalid token type", 400);
    }

    return jsonwebtoken.sign(payload, secret, {
      expiresIn: expiresIn as jsonwebtoken.SignOptions["expiresIn"],
    });
  }
}
export const tokenService = new TokenService();
