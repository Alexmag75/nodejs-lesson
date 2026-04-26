import { EmailTypeEnum } from "../enums/email-type.enum";

export const emailConstants = {
  [EmailTypeEnum.WELCOME]: {
    subject: "Welcome to our platform",
    template: "welcome",
  },
  [EmailTypeEnum.FORGOT_PASSWORD]: {
    subject: "Forgot password",
    template: "forgot-password",
  },
  [EmailTypeEnum.OLD_VISIT]: {
    subject: "old-visit",
    template: "old-visit",
  },
  [EmailTypeEnum.LOGOUT]: {
    subject: "Security notification: Logout performed",
    template: "logout",
  },
  [EmailTypeEnum.VERIFY_EMAIL]: {
    subject: "Confirm your registration",
    template: "verify-email",
  },
};
