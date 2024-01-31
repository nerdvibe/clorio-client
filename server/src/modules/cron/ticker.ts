import { CronJob } from "cron";
import { setTick } from "@modules/ticker/";

export const tickerCron = new CronJob("*/10 * * * * *", async () => {
  await setTick();
});
