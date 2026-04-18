import { ApiError } from "../errors/api-error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import { ISignIn, IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { RoleEnum } from "../enums/role.enum";
import { emailService } from "./email.service";
import { EmailTypeEnum } from "../enums/email-type.enum";

class AuthService {
  public async signUp(dto: Partial<IUser>): Promise<{ user: IUser }> {
    console.log("1. Начало signUp");

    await this.isEmailExistOrThrow(dto.email as string);
    console.log("2. Проверка email пройдена");
    const hashedPassword = await passwordService.hashPassword(
      dto.password as string,
    );
    console.log("3. Пароль захеширован");

    const user = await userRepository.create({
      ...dto,
      password: hashedPassword,
    } as IUser);
    console.log("4. Пользователь создан в БД:", user._id);
    const tokens = tokenService.generateTokens({
      userId: user._id!.toString(),
      role: user.role || RoleEnum.USER,
    });
    console.log("5. Токены сгенерированы");
    await tokenRepository.create({ ...tokens, _userId: user._id! });
    console.log("6. Токены сохранены в БД. СЕЙЧАС ВЫЗОВЕМ ПОЧТУ");
    console.log("--- Пытаемся отправить почту ---");
    console.log("Email юзера:", user.email);
    console.log("Имя юзера:", user.name);

    emailService
      .sendMail(EmailTypeEnum.WELCOME, "aleksandrmargrarit@gmail.com", {
        name: user.name,
      })
      .then(() => console.log("7. УСПЕХ ПОЧТЫ"))
      .catch((err) => console.error("7. ОШИБКА ПОЧТЫ:", err));

    console.log("8. Возвращаем ответ клиенту");
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
