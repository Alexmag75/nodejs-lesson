import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { ApiError } from "../errors/api-error";

class UserMiddleware {
  public validateBody(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.body);
      if (error) return next(new ApiError(error.details[0].message, 400));
      req.body = value;
      next();
    };
  }

  public validateParams(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.params);
      if (error) return next(new ApiError(error.details[0].message, 400));
      next();
    };
  }
}

export const userMiddleware = new UserMiddleware();
