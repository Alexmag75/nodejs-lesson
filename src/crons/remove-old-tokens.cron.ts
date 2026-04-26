import { CronJob } from "cron";
import { configs } from "../config/configs";
import { timeHelper } from "../helpers/time.helper";
import { tokenRepository } from "../repositories/token.repository";

const handler = async () => {
  try {
    const { value, unit } = timeHelper.parseConfigString(
      configs.JWT_REFRESH_EXPIRATION,
    );

    const date = timeHelper.subtractByParams(value, unit);

    const deletedCount = await tokenRepository.deleteBeforeDate(date);

    if (deletedCount > 0) {
      console.log(`[Cron-Tokens] Удалено истекших токенов: ${deletedCount}`);
    }
  } catch (error) {
    console.error("[Cron-Tokens Error]:", error);
  }
};

export const removeOldTokensCronJob = new CronJob("0 1 * * *", handler);
