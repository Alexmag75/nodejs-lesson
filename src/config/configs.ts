import dotenv from "dotenv";

dotenv.config();

export const configs = {
  APP_PORT: process.env.APP_PORT || 3001,
  APP_HOST: process.env.APP_HOST,
  APP_FRONT_URL: process.env.APP_FRONT_URL as string,

  MONGO_URI: process.env.MONGO_URI,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION as string,

  ACTION_FORGOT_PASSWORD_SECRET: process.env
    .ACTION_FORGOT_PASSWORD_SECRET as string,
  ACTION_FORGOT_PASSWORD_EXPIRATION: process.env
    .ACTION_FORGOT_PASSWORD_EXPIRATION as string,

  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
};
