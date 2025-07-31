"use client";

import { gql, DocumentNode } from "@apollo/client";

export const REGISTER_USER: DocumentNode = gql`
  mutation RegisterUser(
    $name: String!
    $email: String!
    $phone_number: Float!
    $password: String!
  ) {
    register(
      registerDto: {
        name: $name
        email: $email
        phone_number: $phone_number
        password: $password
      }
    ) {
      activation_token
    }
  }
`;
