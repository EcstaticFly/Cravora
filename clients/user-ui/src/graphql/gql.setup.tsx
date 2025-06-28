import { ApolloClient, InMemoryCache } from "@apollo/client";

// console.log("GraphQL API URI:", process.env.NEXT_PUBLIC_GRAPHQL_API_URI);
const graphqlClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URI,
  cache: new InMemoryCache(),
});

export default graphqlClient;
