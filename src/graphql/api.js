/* eslint-disable no-undef */
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

console.log(
  process.env.REACT_APP_GQL_SERVER,
  "process.env.REACT_APP_GQL_SERVER",
);

const httpLink = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }),
  new HttpLink({
    uri: process.env.REACT_APP_GQL_SERVER,
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

export const apolloClient = new ApolloClient({
  // link,
  link: httpLink,
  cache: new InMemoryCache(),
});
