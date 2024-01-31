import { db } from "@db/index";
import { sendGraphqlError } from "../../../graphql/util";
import { countValidatorsInCache } from "@modules/cache/validators";

export const queries = {
  newsHome: async () => {
    try {
      const news = await db("news_home")
        .select([
          "id",
          "title",
          "subtitle",
          "version_op",
          "version",
          "link",
          "cta",
          "cta_color",
        ])
        .where("visible", true)
        .limit(5)
        .orderBy("id", "desc");
      return news;
    } catch (e) {
      sendGraphqlError(e);
    }
  },
  newsValidators: async () => {
    try {
      const news = await db("news_validators")
        .select([
          "id",
          "title",
          "subtitle",
          "version_op",
          "version",
          "link",
          "cta",
          "cta_color",
        ])
        .where("visible", true)
        .limit(5)
        .orderBy("id", "desc");
      return news;
    } catch (e) {
      sendGraphqlError(e);
    }
  },
};
