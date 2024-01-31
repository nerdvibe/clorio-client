import { CronJob } from "cron";
import { setMinaNodeInfo } from "@modules/nodeStat";

export const heightCron = new CronJob("*/30 * * * * *", async () => {
  await setMinaNodeInfo();
});
