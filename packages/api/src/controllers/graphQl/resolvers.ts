// GRAPHQL
import { AuthenticationError } from 'apollo-server-errors';
import { Context } from 'graphql-passport/lib/buildContext';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
// INTERNALS
import AuthService from '../../services/AuthServices';
import User from  '../../database/models/User';
import { ErrorBase } from '../../core/apiErrors';

export const resolvers = {
	Query: {
		hello: (): string => 'Hello world!',
	},
	Mutation: {
		signUp: async (_: any, args: User): Promise<Omit<User, 'password'>> => {
			const { nickname, password, email, birthdate } = args;
			try {
				const result = await AuthService.signup(
					nickname,
					password,
					email,
					birthdate,
				);
				return result.data.user;
			} catch (error) {
				if (error instanceof ErrorBase)
					throw new AuthenticationError(error.details);
				throw new AuthenticationError(error);
			}
		},
		signIn: async (
			_: any,
			args: User,
			context: Context<User>,
		): Promise<Omit<User, 'password'>> => {
			const { email, password } = args;
			try {
				const result = await AuthService.signin(
					email,
					password,
					context,
				);
				return result.data.user;
			} catch (error) {
				if (error instanceof ErrorBase)
					throw new AuthenticationError(error.details);
				throw new AuthenticationError(error);
			}
		},
	},
	// EN COURS -> sources
	// https://www.apollographql.com/docs/graphql-tools/scalars/
	// https://stackoverflow.com/a/49694083/12018849
	// https://atheros.ai/blog/how-to-design-graphql-custom-scalars
	// https://hasura.io/blog/postgres-date-time-data-types-on-graphql-fd926e86ee87/

	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'Date custom scalar type',
		parseValue(value) {
			console.log("VALUE1")
			console.log(value)
		  return new Date(value); // value from the client
		},
		serialize(value) {
			console.log("VALUE2")
			console.log(value)

		  return value.getTime(); // value sent to the client
		},
		parseLiteral(ast) {
		  if (ast.kind === Kind.INT) {
			return new Date(+ast.value) // ast value is always in string format
		  }
		  return null;
		},
	  }),
};
