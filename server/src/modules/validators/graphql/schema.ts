import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type ValidatorsCount {
    count: Int
  }
  type Validator {
    name: String!
    website: String
    publicKey: String!
    id: String!
    image: String
    payoutTerms: String
    stakePercent: String
    stakedSum: String
    twitter: String
    telegram: String
    github: String,
    email: String
    discordUsername: String
    discordGroup: String
    deletorsNum: String
    fee: String
    providerId: String!
    priority: String!
  }

  type Query {
    validatorsCount: ValidatorsCount
    validators(offset: Int): [Validator]
  }
`);
