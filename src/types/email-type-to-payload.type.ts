import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailPayloadCombined } from "./email-payload-combined.type";
import { PickRequired } from "./pick-required.type";

export type EmailTypeToPayload = {
  [EmailTypeEnum.WELCOME]: PickRequired<EmailPayloadCombined, "name">;

  [EmailTypeEnum.FORGOT_PASSWORD]: PickRequired<
    EmailPayloadCombined,
    "name" | "email"
  >;

  [EmailTypeEnum.OLD_VISIT]: {
    name: string;
    frontUrl: string;
  };
  [EmailTypeEnum.LOGOUT]: PickRequired<EmailPayloadCombined, "name">;

  [EmailTypeEnum.VERIFY_EMAIL]: {
    name: string;
    frontUrl: string;
    actionToken: string;
  };
};
