// GRAPHQL
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
	type Query {
		hello: String
	}
	type Mutation {
		signUp(
			nickname: String!
			email: String!
			password: String!
		): UserWithoutPwd
		signIn(
			nickname: String!
			email: String!
			password: String!
		): UserWithoutPwd!
	}
	type UserWithoutPwd {
		uuid: String!
		nickname: String!
		email: String!
	}
`;
