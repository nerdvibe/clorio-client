import { db } from "@db/index";
import { sendGraphqlError } from "../../../graphql/util";
import { countValidatorsInCache } from "@modules/cache/validators";

export const queries = {
  validatorsCount: () => {
    try {
      return {
        count: countValidatorsInCache(),
      };
    } catch (e) {
      sendGraphqlError(e);
    }
  },
  validators: async ({ offset = 0 }) => {
    try {
      const validators = await db("validators")
        .select([
          "fee",
          "id",
          "image",
          "name",
          "publicKey",
          "website",
          "stakedSum",
          "providerId",
          "priority",
        ])
        .orderBy("priority", "asc")
        .offset(offset)
        .limit(50);
      return validators;
    } catch (e) {
      sendGraphqlError(e);
    }
  },
};
