import { CronJob } from "cron";
import { cacheBlacklistedAddresses } from "@modules/blacklistedAddresses/cacheBlacklistedAddresses";

export const blacklistedAddressesCron = new CronJob("0 * * * *", async () => { // every hour
  await cacheBlacklistedAddresses();
});
