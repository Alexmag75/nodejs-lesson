import * as jsonwebtoken from "jsonwebtoken";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { configs } from "../config/configs";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";

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

  public verifyToken(token: string, type: TokenTypeEnum): ITokenPayload {
    try {
      const secret =
        type === TokenTypeEnum.ACCESS
          ? configs.JWT_ACCESS_SECRET
          : configs.JWT_REFRESH_SECRET;

      return jsonwebtoken.verify(token, secret) as ITokenPayload;
    } catch {
      throw new ApiError("Invalid token", 401);
    }
  }
}
export const tokenService = new TokenService();
