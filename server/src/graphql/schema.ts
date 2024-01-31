import { stitchSchemas } from "@graphql-tools/stitch";
import { mergeResolvers } from "@graphql-tools/merge";

// Schemas
import { schema as accountsSchema } from "@modules/accounts/graphql/schema";
import { schema as feesSchema } from "@modules/fees/graphql/schema";
import { schema as tickerSchema } from "@modules/ticker/graphql/schema";
import { schema as nodeStatsSchema } from "@modules/nodeStat/graphql/schema";
import { schema as transactionsSchema } from "@modules/transactions/graphql/schema";
import { schema as blacklistedAddressesSchema } from "@modules/blacklistedAddresses/graphql/schema";
import { schema as validatorsSchema } from "@modules/validators/graphql/schema";
import { schema as newsSchema } from "@modules/news/graphql/schema";

// Queries
import { queries as accountQueries } from "@modules/accounts/graphql/queries";
import { queries as feesDealsQueries } from "@modules/fees/graphql/queries";
import { queries as tickerQueries } from "@modules/ticker/graphql/queries";
import { queries as nodeStatsQueries } from "@modules/nodeStat/graphql/queries";
import { queries as transactionsQueries } from "@modules/transactions/graphql/queries";
import { queries as blacklistedAddressesQueries } from "@modules/blacklistedAddresses/graphql/queries";
import { queries as validatorsQueries } from "@modules/validators/graphql/queries";
import { queries as newsQueries } from "@modules/news/graphql/queries";

// Mutations
import { mutations as transactionsMutations } from "@modules/transactions/graphql/mutations";

// setup subschema configurations
export const accountsSubschema = { schema: accountsSchema };
export const feesSubschema = { schema: feesSchema };
export const tickerSubschema = { schema: tickerSchema };
export const nodeStatsSubschema = { schema: nodeStatsSchema };
export const transactionsSubschema = { schema: transactionsSchema };
export const blacklistedAddressesSubschema = {
  schema: blacklistedAddressesSchema,
};
export const validatorsSubschema = {
  schema: validatorsSchema,
};
export const newsSubschema = {
  schema: newsSchema,
};

// setup resolvers
const resolvers = [
  accountQueries,
  feesDealsQueries,
  tickerQueries,
  nodeStatsQueries,
  transactionsQueries,
  transactionsMutations,
  blacklistedAddressesQueries,
  validatorsQueries,
  newsQueries
];

// Merged resolvers
export const root = mergeResolvers(resolvers);

// Merged schemas
export const graphqlSchema = stitchSchemas({
  subschemas: [
    accountsSubschema,
    feesSubschema,
    tickerSubschema,
    nodeStatsSubschema,
    transactionsSubschema,
    blacklistedAddressesSubschema,
    validatorsSubschema,
    newsSubschema
  ],
});
