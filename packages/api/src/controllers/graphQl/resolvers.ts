// GRAPHQL
import { AuthenticationError } from 'apollo-server-errors';
import { Context } from 'graphql-passport/lib/buildContext';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
// INTERNALS
import AuthService from '../../services/AuthServices';
import User from '../../database/models/User';
import { ErrorBase } from '../../core/apiErrors';

export const resolvers = {
	Query: {
		hello: (): string => 'Hello world!',
	},
	Mutation: {
		signUp: async (
			_: any,
			args: User,
		): Promise<Omit<IUser, 'password'> & IToken> => {
			const { nickname, password, email, birthdate } = args;
			try {
				const result = await AuthService.signup(
					nickname,
					password,
					email,
					birthdate,
				);
				return { ...result.data.user, ...result.meta };
			} catch (error) {
				if (error instanceof ErrorBase)
					throw new AuthenticationError(error.message);
				throw new AuthenticationError('Unexpected error');
			}
		},
		signIn: async (
			_: any,
			args: User,
			context: Context<User>,
		): Promise<Omit<IUser, 'password'> & IToken> => {
			const { email, password } = args;
			try {
				const result = await AuthService.signin(
					email,
					password,
					context,
				);
				return { ...result.data.user, ...result.meta };
			} catch (error) {
				if (error instanceof ErrorBase)
					throw new AuthenticationError(error.message);
				throw new AuthenticationError('Unexpected error');
			}
		},
	},
	Date: new GraphQLScalarType({
		name: 'Date',
		description: 'AAAA-MM-DD',
		parseValue(value) {
			return new Date(value).toISOString(); // value from the client
		},
		serialize(value) {
			return value; // value sent to the client
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.STRING) {
				return new Date(ast.value).toISOString();
			}
			return null;
		},
	}),
};
