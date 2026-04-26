import { CronJob } from "cron";
import dayjs from "dayjs";
import { oldPasswordRepository } from "../repositories/old-password.repository";

const handler = async () => {
  try {
    const dateLimit = dayjs().subtract(180, "days").toDate();

    const deletedCount =
      await oldPasswordRepository.deleteBeforeDate(dateLimit);

    if (deletedCount > 0) {
      console.log(`[Cron-Passwords] Удалено старых паролей: ${deletedCount}`);
    }
  } catch (error) {
    console.error("[Cron-Passwords Error]:", error);
  }
};

export const cleanOldPasswordsCronJob = new CronJob("0 0 * * *", handler);
