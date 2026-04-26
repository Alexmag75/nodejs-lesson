import { removeOldTokensCronJob } from "./remove-old-tokens.cron";
import { cleanOldPasswordsCronJob } from "./clean-old-passwords.cron";
import { remindOldUsersCronJob } from "./remind-old-users.cron";

export const cronRunner = () => {
  removeOldTokensCronJob.start();
  cleanOldPasswordsCronJob.start();
  remindOldUsersCronJob.start();

  console.log("--- Фоновые задачи (Cron) запущены ---");
};
