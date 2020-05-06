// PASSPORT
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// GRAPHQL
import { GraphQLLocalStrategy } from 'graphql-passport';
// INTERNALS
import UserRepository from '../repositories/userRepository';
import User from '../entity/User';
require('dotenv').config(); // TODO: move into main

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (email, password, next) => {
			try {
				const user:
					| User
					| undefined = await UserRepository.instance.get({
					email,
				});

				if (!user) return next('User does not exist');

				if (!User.checkIfUnencryptedPasswordIsValid(user, password))
					return next('Password does not match');

				return next(false, user);
			} catch (err) {
				return next(err.message);
			}
		},
	),
);

passport.use(
	new GraphQLLocalStrategy(
		async (
			username: any,
			password: any,
			next: (error: any, user?: any) => void,
		) => {
			try {
				const user:
					| User
					| undefined = await UserRepository.instance.get({
					email: username,
				});

				if (!user) return next(null, false);
				if (!User.checkIfUnencryptedPasswordIsValid(user, password))
					return next(null, false);

				return next(false, user);
			} catch (err) {
				return next(err.message);
			}
		},
	),
);

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // return 401 if format is not token
			secretOrKey: String(process.env.SECRET),
		},
		async (jwtPayload, next) => {
			try {
				const user:
					| User
					| undefined = await UserRepository.instance.get({
					uuid: jwtPayload.uuid,
				});

				if (!user) throw new Error('user not found');

				return next(false, user);
			} catch (err) {
				return next(err.message); // status 500
			}
		},
	),
);
