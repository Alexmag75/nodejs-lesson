import { ApiError } from "../errors/api-error";
import { ITokenPair } from "../interfaces/token.interface";
import { ISignIn, IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { RoleEnum } from "../enums/role.enum";

class AuthService {
  public async signUp(
    dto: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    if (!dto.email || !dto.password) {
      throw new ApiError("Email and password are required", 400);
    }

    await this.isEmailExistOrThrow(dto.email);

    const hashedPassword = await passwordService.hashPassword(dto.password);

    const user = await userRepository.create({
      ...dto,
      password: hashedPassword,
    } as IUser);

    const tokens = tokenService.generateTokens({
      userId: user._id!.toString(),
      role: user.role || RoleEnum.USER,
    });

    await tokenRepository.create({ ...tokens, _userId: user._id! });
    return { user, tokens };
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
      throw new ApiError("Invalid credentials", 401);
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
      throw new ApiError("Email already exists", 409);
    }
  }
}
export const authService = new AuthService();

// TODO add refresh token service
