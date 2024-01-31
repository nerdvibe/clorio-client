import { db } from "@db/index";
import { mempool } from "@modules/graphqlProxy/lib/mempool";
import { sendGraphqlError } from "../../../graphql/util";
import { decodeB58 } from "@modules/utils/decodeMemo";

export interface MempoolQueryArgs {
  publicKey: string;
}

const LIMIT = 15;

export const queries = {
  mempool: ({ publicKey }: MempoolQueryArgs) => {
    try {
      return mempool(publicKey);
    } catch (e) {
      sendGraphqlError(e);
    }
  },
  transactionsCount: async ({ accountId }) => {
    try {
      if (!accountId) {
        throw new Error("No id provided");
      }
      const count = await db("user_commands")
        .where("source_id", accountId)
        .orWhere("receiver_id", accountId)
        .count("id")
        .first();
      return {
        count: count?.count ?? 0,
      };
    } catch (e) {
      sendGraphqlError(e);
    }
  },
  transactions: async ({ accountId, offset }) => {
    try {
      if (!accountId) {
        throw new Error("Missing accountId");
      }

      // If is Berkeley
      if (process.env.CHAIN_VERSION == "2") {
        const result = await db("user_commands")
          .join(
            "blocks_user_commands",
            "user_commands.id",
            "blocks_user_commands.user_command_id"
          )
          .join("blocks", "blocks_user_commands.block_id", "blocks.id")
          .join(
            "account_identifiers AS ai_sender",
            "user_commands.source_id",
            "ai_sender.public_key_id"
          )
          .join(
            "public_keys AS pk_sender",
            "ai_sender.public_key_id",
            "pk_sender.id"
          )
          .join(
            "account_identifiers AS ai_receiver",
            "user_commands.receiver_id",
            "ai_receiver.public_key_id"
          )
          .join(
            "public_keys AS pk_receiver",
            "ai_receiver.public_key_id",
            "pk_receiver.id"
          )
          .select([
            "user_commands.id as id",
            "user_commands.source_id",
            "user_commands.receiver_id",
            "user_commands.amount",
            "user_commands.fee",
            "user_commands.fee_payer_id",
            "user_commands.hash",
            "user_commands.memo",
            "user_commands.command_type",
            "user_commands.nonce",
            "blocks_user_commands.status",
            "blocks_user_commands.failure_reason",
            "blocks.timestamp",
            "blocks.height",
            "blocks.state_hash",
            "pk_sender.value as sender_public_key",
            "pk_receiver.value as receiver_public_key",
          ])
          .where(function () {
            this.where("user_commands.source_id", accountId).orWhere(
              "user_commands.receiver_id",
              accountId
            );
          })
          .andWhere("command_type", "payment")
          .orderBy("user_commands.id", "desc")
          .limit(LIMIT)
          .offset(offset);

        const decodedResults = result.map((r) => {
          r.memo = decodeB58(r.memo);
          return r;
        });
        return decodedResults;
      }

      // earlier than Berkeley
      const result = await db("user_commands")
        .select([
          "user_commands.id as id",
          "user_commands.type as command_type",
          "user_commands.fee_payer_id",
          "user_commands.source_id",
          "user_commands.receiver_id",
          "user_commands.nonce",
          "user_commands.amount",
          "user_commands.fee",
          "user_commands.valid_until",
          "user_commands.memo",
          "user_commands.hash",
          "blocks.timestamp",
          "blocks.height",
          "blocks.state_hash",
          "src.value as sender_public_key",
          "rcv.value as receiver_public_key",
        ])
        .join("public_keys as src", "user_commands.source_id", "src.id")
        .join("public_keys as rcv", "user_commands.receiver_id", "rcv.id")
        .join(
          "blocks_user_commands",
          "user_commands.id",
          "blocks_user_commands.user_command_id"
        )
        .join("blocks", "blocks_user_commands.block_id", "blocks.id")
        .where("user_commands.source_id", accountId)
        .orWhere("user_commands.receiver_id", accountId)
        .orderBy("user_commands.id", "desc")
        .limit(LIMIT)
        .offset(offset);

      return result;
    } catch (e) {
      console.log(e);
    }
  },
};
