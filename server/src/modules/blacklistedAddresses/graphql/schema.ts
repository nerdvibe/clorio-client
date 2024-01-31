import { buildSchema } from "graphql";

export const schema = buildSchema(`

  type BlacklistedAddress {
    address: String
  }

  type Query {
    blacklistedAddresses: [BlacklistedAddress]
  }
`);
