import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error";
import { UploadedFile } from "express-fileupload";

class FileMiddleware {
  public isFileValid() {
    return (req: Request, _res: Response, next: NextFunction) => {
      try {
        if (!req.files || !req.files.avatar) {
          return next(new ApiError("Файл аватара не найден", 400));
        }

        const file = req.files.avatar as UploadedFile;

        if (!file.mimetype.startsWith("image/")) {
          return next(new ApiError("Разрешены только изображения", 400));
        }

        if (file.size > 2 * 1024 * 1024) {
          return next(new ApiError("Файл слишком большой", 400));
        }

        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const fileMiddleware = new FileMiddleware();
