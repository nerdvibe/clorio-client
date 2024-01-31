import { CronJob } from "cron";
import { setFee } from "@modules/fees";

export const feesCron = new CronJob("*/15 * * * * *", async () => {
  await setFee();
});
