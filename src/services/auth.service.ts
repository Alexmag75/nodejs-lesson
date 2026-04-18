import { ApiError } from "../errors/api-error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { ISignIn, IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { RoleEnum } from "../enums/role.enum";

class AuthService {
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
}
export const authService = new AuthService();
