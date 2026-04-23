import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api-error";

class CommonMiddleware {
  public isIdValid(key: string) {
    return (req: Request, _res: Response, next: NextFunction): void => {
      if (!isObjectIdOrHexString(req.params[key])) {
        return next(new ApiError("Invalid ID", 400));
      }
      next();
    };
  }

  public isBodyValid(validator: ObjectSchema) {
    return async (
      req: Request,
      _res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        req.body = await validator.validateAsync(req.body);
        next();
      } catch (e: any) {
        next(new ApiError(e.details?.[0]?.message || "Validation error", 400));
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
