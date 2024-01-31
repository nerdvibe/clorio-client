import axios from "axios";
import { logger } from "@modules/log";
import { db } from "../../db";
import { validatorsCacheSet } from "@modules/cache/validators";
const VALIDATORS_URL = "https://api.staketab.com/mina/get_providers";

const log = logger("FETCH_VALIDATORS");

const fixedData = {
  25: { priority: 1, website: "https://mina.westake.club/" }, // Carbonara - API returning wrong data
  266: { fee: 100 }, // Coinlist - Private pool
};
// List of pools to be excluded from the list. E.g. because duplicated public key, malicious etc.
// external API is currently returning a bunch of non validator data, we filter them here
const bannedPublicKeys = [
  "B62qkj3CCj2V3pBPPufCuWSkoP2RwjAZkgPZfLKFUae3hPoBEhRtmyo", // duplicated
  "B62qkRodi7nj6W1geB12UuW2XAx2yidWZCcDthJvkf9G4A6G5GFasVQ", // kraken
  "B62qmiVk5Bt8d45eo9uQLrZzWberLgqSRTfkNm7ma1Rh9fgnzFqtiHb", // bilaxy
  "B62qpWaQoQoPL5AGta7Hz2DgJ9CJonpunjzCGTdw8KiCCD1hX8fNHuR", // okex
  "B62qmjZSQHakvWz7ZMkaaVW7ye1BpxdYABAMoiGk3u9bBaLmK5DJPkR", // coinlist
  "B62qm7vP2JPj1d8XDmGUiv3GtwAfzuaxrdNsiXdWmZ7QqXZtzpVyGPG", // gateio?
  "B62qm2wh99cMx3U94SnNKPCo6yPnZM49A2J6ad9i3HX2o5TucVZJEGq", // trash account from api?
  "B62qqmgjAjoKRgt1ptEdqnFN8LTmBKj8YdSEVKxnAxcFtiRXYeUV3pD", // trash account from api?
  "B62qnSUbgFfPTsZGPhFU9hEy4PerBLCHVcTCYthU7BUN75nHiZQPg6r", // trash account from api?
  "B62qrRvo5wngd5WA1dgXkQpCdQMRDndusmjfWXWT1LgsSFFdBS9RCsV", // binance
];
const bannedNames = [
  "❗️ Warning. SCAM alert!",
  ".",
  "Mina Foundation",
  "O(1) Labs Address",
];

// Count how many priority bumps are there
const priorityOffset = Object.keys(fixedData).reduce(
  (acc, curr) => (fixedData[curr].priority ? acc + 1 : acc),
  0
);

export const fetchValidators = async () => {
  try {
    const { data } = await axios.get(VALIDATORS_URL);
    const validatorsRaw = data.staking_providers;

    const validatorsRawUniqueAddresses = [
      ...new Map(
        validatorsRaw.map((item) => [item.provider_address, item])
      ).values(),
    ];

    const validatorsRawUnique = [
      ...new Map(
        validatorsRawUniqueAddresses.map((item: any) => [
          item.provider_title,
          item,
        ])
      ).values(),
    ];

    const validators = (validatorsRawUnique as any).map((v) => ({
      name: v.provider_title,
      fee: v.provider_fee,
      website: v.website,
      publicKey: v.provider_address,
      image: v.provider_logo,
      payoutTerms: v.payout_terms,
      stakePercent: v.stake_percent,
      stakedSum: v.staked_sum,
      twitter: v.twitter,
      telegram: v.telegram,
      github: v.github,
      email: v.email,
      discordUsername: v.discord_username,
      discordGroup: v.discord_group,
      delegatorsNum: v.delegators_num,
      providerId: v.provider_id,
      ...fixedData[v.provider_id],
    }));

    const filteredValidators = validators
      .filter((validator) => !bannedPublicKeys.includes(validator.publicKey))
      .filter((validator) => !bannedNames.includes(validator.name));
    const sortedValidators = filteredValidators.sort(
      (a, b) => b.stakedSum - a.stakedSum
    );
    const prioritizedValidators = sortedValidators.map((v, index) => ({
      ...v,
      priority: v.priority ? v.priority : index + 1 + priorityOffset,
    }));

    try {
      await db("validators")
        .insert(prioritizedValidators)
        .onConflict("publicKey")
        .merge();
    } catch (e) {
      log.error("Failed to upsert validators ", e);
    }

    // create the cache
    const validatorsNameValue = filteredValidators.map((v) => ({
      name: v.name,
      publicKey: v.publicKey,
    }));

    await validatorsCacheSet(validatorsNameValue);

    log.info("validators inserted");

    return;
  } catch (e) {
    log.info(e);
  }
};
