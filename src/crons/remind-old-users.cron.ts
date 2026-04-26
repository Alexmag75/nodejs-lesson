import { CronJob } from "cron";
import dayjs from "dayjs";
import { User } from "../models/user.model";
import { emailService } from "../services/email.service";
import { EmailTypeEnum } from "../enums/email-type.enum";

const handler = async () => {
  try {
    const sevenDaysAgo = dayjs().subtract(7, "days").toDate();

    const usersToRemind = await User.find({
      lastVisit: { $lte: sevenDaysAgo },
    });

    for (const user of usersToRemind) {
      await emailService.sendMail(EmailTypeEnum.OLD_VISIT, user.email, {
        name: user.name,
        frontUrl: "...",
      });

      await User.findByIdAndUpdate(user._id, { lastVisit: new Date() });
    }

    if (usersToRemind.length > 0) {
      console.log(
        `[Cron-Remind] Sent reminder to ${usersToRemind.length} users`,
      );
    }
  } catch (error) {
    console.error("[Cron-Remind Error]:", error);
  }
};

export const remindOldUsersCronJob = new CronJob("0 12 * * *", handler);
