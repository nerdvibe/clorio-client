import { account as minaNodeAccount } from "@modules/graphqlProxy";
import { sendGraphqlError } from "../../../graphql/util";
import { db } from "@db/index";
import { validate } from "graphql";

export const queries = {
  accountByKey: async (publicKey) => {
    try {
      return await minaNodeAccount(publicKey);
    } catch (e) {
      sendGraphqlError(e);
    }
  },
  idByPublicKey: async ({ publicKey }) => {
    try {
      if (!publicKey) {
        throw new Error("No public key provided");
      }
      const address = await db("public_keys").where("value", publicKey).first();
      return { id: address?.id ?? undefined };
    } catch (e) {
      sendGraphqlError(e);
    }
  },
};
