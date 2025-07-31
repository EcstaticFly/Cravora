import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import Cookies from "js-cookie";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URI,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      accesstoken: Cookies.get("access_token"),
      refreshtoken: Cookies.get("refresh_token"),
    },
  });

  return forward(operation);
});

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const headers = context.response.headers;

    const newAccessToken = headers.get("x-new-accesstoken");
    const newRefreshToken = headers.get("x-new-refreshtoken");

    if (newAccessToken) {
      Cookies.set("access_token", newAccessToken);
    }

    if (newRefreshToken) {
      Cookies.set("refresh_token", newRefreshToken);
    }

    return response;
  });
});

const graphqlClient = new ApolloClient({
  link: ApolloLink.from([authMiddleware, afterwareLink, httpLink]),
  cache: new InMemoryCache(),
});

export default graphqlClient;
