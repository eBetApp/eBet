// GRAPHQL
import { AuthenticationError } from 'apollo-server-errors';
import { Context } from 'graphql-passport/lib/buildContext';
// INTERNALS
import AuthService from '../../services/AuthServices';
import User from  '../../database/models/User';
import { DatabaseError } from '../../core/ApiErrors';

export const resolvers = {
	Query: {
		hello: (): string => 'Hello world!',
	},
	Mutation: {
		signUp: async (_: any, args: User): Promise<Omit<User, 'password'>> => {
			const { nickname, password, email } = args;
			try {
				const result = await AuthService.signup(
					nickname,
					password,
					email,
				);
				return result.data.user;
			} catch (error) {
				if (error instanceof DatabaseError)
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
				const result = await AuthService.signinGraphQL(
					email,
					password,
					context,
				);
				return result.data.user;
			} catch (error) {
				if (error instanceof DatabaseError)
					throw new AuthenticationError(error.details);
				throw new AuthenticationError(error);
			}
		},
	},
};
