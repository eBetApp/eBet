// EXPRESS
import { Request, Response } from 'express';
// ORM
import { QueryFailedError } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
// PASSPORT
import * as jwt from 'jsonwebtoken';
import passport from 'passport';
// GRAPHQL
import { Context } from 'graphql-passport/lib/buildContext';
// MAILGUN
import { SendMail, Mail } from './mailGunService';
// INTERNALS
import User from '../database/models/User';
import UserRepository from '../database/repositories/userRepository';
import { DatabaseError } from '../core/ApiErrors';

class AuthService {
	static setToken(user: User): string {
		const { uuid, nickname, email } = user;
		return jwt.sign({ uuid, nickname, email }, String(process.env.SECRET));
	}

	static async signup(
		nickname: string,
		password: string,
		email: string,
	): Promise<AuthServiceResponse> {
		const user: User = new User();
		user.nickname = nickname;
		user.password = password;
		user.email = email;

		const errors: ValidationError[] = await validate(user);
		if (errors.length > 0)
			throw new DatabaseError('Incorrect data', 400, undefined, errors);

		try {
			User.hashPassword(user);

			const createdUser = await UserRepository.instance.create(user);
			delete createdUser.password;

			const token = this.setToken(createdUser);

			const data: Mail = {
				from: 'eBet company <eBetCompany@eBetCompany.org>',
				to: createdUser.email,
				subject: 'Subscription',
				text: `Congratulations ${createdUser.nickname}, you are now registered to eBet!`,
			};

			SendMail(data);

			return {
				status: 201,
				data: { user: createdUser },
				meta: { token },
			};
		} catch (error) {
			if (error instanceof QueryFailedError)
				throw new DatabaseError(error.message, 400, undefined, error);
			throw new DatabaseError('Unexpected error', 400);
		}
	}

	static async signin(
		req: Request,
		res: Response,
	): Promise<AuthServiceResponse> {
		return new Promise(
			(resolve: (result: AuthServiceResponse) => void, reject: any) => {
				passport.authenticate(
					'local',
					{ session: false },
					(error, user) => {
						if (!error && user) {
							const token = this.setToken(user);

							const { ...userToReturn } = user;
							delete userToReturn.password;

							return resolve({
								status: 200,
								data: { user: userToReturn },
								meta: { token },
							});
						}
						return reject(new DatabaseError(error, 400));
					},
				)(req, res);
			},
		);
	}

	static async signinGraphQL(
		nickname: string,
		pwd: string,
		context: Context<User>,
	): Promise<AuthServiceResponse> {
		try {
			const { user } = await context.authenticate('graphql-local', {
				username: nickname,
				password: pwd,
			});

			if (user === undefined) {
				throw new DatabaseError(
					'[GRAPHQL] Unable to login with those credentials.',
					400,
				);
			}

			const token = this.setToken(user);
			const { ...userToReturn } = user;
			delete userToReturn.password;

			return {
				status: 200,
				data: { user: userToReturn },
				meta: { token },
			};
		} catch (error) {
			if (error instanceof DatabaseError) throw error;
			throw new DatabaseError('Unexpected error', 500, undefined, error);
		}
	}
}

export default AuthService;
