import { db } from "./";
import { newsHomeSchema, newsValidatorsSchema, validatorsSchema } from "./initQueries";

export const initDb = async () => {
  return;
  const validatorsExist = await db.schema.hasTable("validators");
  if (!validatorsExist) {
    await db.raw(validatorsSchema);
  }

  const newsValidatorsExist = await db.schema.hasTable("news_validators");
  if (!newsValidatorsExist) {
    await db.raw(newsValidatorsSchema);
  }

  const newsHomeExist = await db.schema.hasTable("news_home");
  if (!newsHomeExist) {
    await db.raw(newsHomeSchema);
  }
};
