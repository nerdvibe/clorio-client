import { CronJob } from "cron";
import { fetchValidators } from "@modules/validators/fetchValidators";

export const validatorsCron = new CronJob("0 */12 * * *", async () => {
  await fetchValidators();
});
