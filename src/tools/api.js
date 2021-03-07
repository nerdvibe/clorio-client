import { WebSocketLink } from "apollo-link-ws";
import { ApolloLink, split } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
const wsLink = new WebSocketLink({
  uri: "wss://minahub02.carbonara.science/v1/graphql",
  options: {
    reconnect: true,
    connectionParams: async () => {
      return {
        headers: {
          "x-hasura-role": "anon",
        },
      };
    },
  },
});

const httpLink = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }),
  new HttpLink({
    uri: "https://minahub02.carbonara.science/v1/graphql",
    credentials: "same-origin",
    options: {
      reconnect: true,
      connectionParams: async () => {
        return {
          headers: {
            "x-hasura-role": "anon",
          },
        };
      },
    },
  }),
]);

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
