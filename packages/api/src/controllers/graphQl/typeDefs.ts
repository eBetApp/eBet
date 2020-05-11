// GRAPHQL
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
	scalar Date
	type Query {
		hello: String
	}
	type Mutation {
		signUp(
			nickname: String!
			email: String!
			birthdate: Date!
			password: String!
		): UserWithoutPwd
		signIn(email: String!, password: String!): UserWithoutPwd!
	}
	type UserWithoutPwd {
		uuid: String!
		nickname: String!
		birthdate: Date!
		email: String!
		token: String!
	}
`;
