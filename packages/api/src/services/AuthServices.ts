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
import {
	ErrorBase,
	FormatError,
	UnexpectedError,
	AuthorizationError,
} from '../core/ApiErrors';

class AuthService {
	static setToken(user: User): string {
		const { uuid, nickname, email } = user;
		return jwt.sign({ uuid, nickname, email }, String(process.env.SECRET));
	}

	static async signup(
		nickname: string,
		password: string,
		email: string,
	): Promise<IAuthServiceResponse> {
		const user: User = new User();
		user.nickname = nickname;
		user.password = password;
		user.email = email;

		const errors: ValidationError[] = await validate(user);
		if (errors.length > 0) {
			throw new FormatError(Object.values(errors[0].constraints)[0]);
		}

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
				throw new FormatError(error.message);
			throw new UnexpectedError('Unexpected error', error);
		}
	}

	static async signin(
		req: Request,
		res: Response,
	): Promise<IAuthServiceResponse>;
	static async signin(
		nickname: string,
		pwd: string,
		context: Context<User>,
	): Promise<IAuthServiceResponse>;

	static async signin(
		paramOne: Request | string,
		paramTwo: Response | string,
		paramThree?: Context<User>,
	): Promise<IAuthServiceResponse> {
		if (typeof paramOne === 'string')
			return await AuthService.signinGraphQL(
				paramOne,
				paramTwo as string,
				paramThree as Context<User>,
			);
		return await AuthService.signinRest(
			paramOne,
			paramTwo as Response,
		);
	}

	private static async signinRest(
		req: Request,
		res: Response,
	): Promise<IAuthServiceResponse> {
		return new Promise(
			(resolve: (result: IAuthServiceResponse) => void, reject: any) => {
				passport.authenticate(
					'local',
					{ session: false },
					(error, user) => {
						if (!error && user) {
							const token = this.setToken(user);

							delete user.password;

							return resolve({
								status: 200,
								data: { user },
								meta: { token },
							});
						}
						return reject(new FormatError(error));
					},
				)(req, res);
			},
		);
	}

	private static async signinGraphQL(
		nickname: string,
		pwd: string,
		context: Context<User>,
	): Promise<IAuthServiceResponse> {
		try {
			const { user } = await context.authenticate('graphql-local', {
				username: nickname,
				password: pwd,
			});

			if (user === undefined)
				throw new AuthorizationError(
					'Unable to login with those credentials.',
				);

			const token = this.setToken(user);
			delete user.password;

			return {
				status: 200,
				data: { user },
				meta: { token },
			};
		} catch (error) {
			if (error instanceof ErrorBase) throw error;
			throw new UnexpectedError('Unexpected error', error);
		}
	}
}

export default AuthService;
