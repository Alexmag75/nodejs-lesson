import { ApiError } from "../errors/api-error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import {
  IResetPasswordSend,
  IResetPasswordSet,
  ISignIn,
  IUser,
} from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { RoleEnum } from "../enums/role.enum";
import { emailService } from "./email.service";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { actionTokenRepository } from "../repositories/action-token.repository";

class AuthService {
  public async logout(
    userId: string,
    tokenId: string,
    userName: string,
    email: string,
  ): Promise<void> {
    await tokenRepository.deleteTokenById(tokenId);

    await emailService.sendMail(EmailTypeEnum.LOGOUT, email, {
      name: userName,
    });
  }

  public async logoutAll(userId: string): Promise<void> {
    await tokenRepository.deleteByUserId(userId);
  }

  public async signUp(dto: Partial<IUser>): Promise<{ user: IUser }> {
    await this.isEmailExistOrThrow(dto.email as string);

    const hashedPassword = await passwordService.hashPassword(
      dto.password as string,
    );

    const user = await userRepository.create({
      ...dto,
      password: hashedPassword,
    } as IUser);

    const tokens = tokenService.generateTokens({
      userId: user._id!.toString(),
      role: user.role || RoleEnum.USER,
    });

    await tokenRepository.create({ ...tokens, _userId: user._id! });
    await emailService.sendMail(
      EmailTypeEnum.WELCOME,
      "aleksandrmargrarit@gmail.com",
      { name: user.name },
    );

    return { user };
  }

  public async signIn(
    dto: ISignIn,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    const user = await userRepository.getByEmail(dto.email);

    if (!user) {
      throw new ApiError("User  не найден", 404);
    }

    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new ApiError("Неверные учетные данные", 401);
    }

    const tokens = tokenService.generateTokens({
      userId: user._id!.toString(),
      role: user.role || RoleEnum.USER,
    });

    await tokenRepository.create({ ...tokens, _userId: user._id });
    return { user, tokens };
  }

  private async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (user) {
      throw new ApiError("Адрес электронной почты уже существует.", 409);
    }
  }
  public async refresh(
    payload: ITokenPayload,
    oldTokenPair: any,
  ): Promise<ITokenPair> {
    await tokenRepository.deleteById(oldTokenPair._id);

    const newTokens = tokenService.generateTokens({
      userId: payload.userId,
      role: payload.role,
    });

    await tokenRepository.create({ ...newTokens, _userId: payload.userId });

    return newTokens;
  }

  public async forgotPasswordSendEmail(dto: IResetPasswordSend): Promise<void> {
    const user = await userRepository.getByEmail(dto.email);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const token = tokenService.generateActionTokens(
      { userId: user._id!, role: user.role },
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );
    await actionTokenRepository.create({
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      _userId: user._id,
      token,
    });

    await emailService.sendMail(
      EmailTypeEnum.FORGOT_PASSWORD,
      "aleksandrmargrarit@gmail.com",
      {
        name: user.name,
        email: user.email,
        actionToken: token,
      } as any,
    );
  }

  public async forgotPasswordSet(
    dto: IResetPasswordSet,
    jwtPayload: ITokenPayload,
  ): Promise<void> {
    const password = await passwordService.hashPassword(dto.password);
    await userRepository.updateById(jwtPayload.userId, { password });

    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
    });
    await tokenRepository.deleteManyByParams({ _userId: jwtPayload.userId });
  }
}
export const authService = new AuthService();
