import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error";
import path from "path";

class FileMiddleware {
  public isFileValid() {
    return (req: Request, _res: Response, next: NextFunction) => {
      try {
        if (!req.files || !req.files.avatar) {
          return next(new ApiError("Файл аватара не найден", 400));
        }

        const file = req.files.avatar;

        const avatarFile = Array.isArray(file) ? file[0] : file;

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedMimeTypes.includes(avatarFile.mimetype)) {
          return next(
            new ApiError("Допустимы только форматы: jpeg, png, webp", 400),
          );
        }

        const fileExtension = path.extname(avatarFile.name).toLowerCase();
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
        if (!allowedExtensions.includes(fileExtension)) {
          return next(new ApiError("Неверное расширение файла", 400));
        }

        if (avatarFile.size > 2 * 1024 * 1024) {
          return next(new ApiError("Файл слишком большой (макс. 2МБ)", 400));
        }

        req.files.avatar = avatarFile;

        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const fileMiddleware = new FileMiddleware();
