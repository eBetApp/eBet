// SERVER
import { Request, Response } from 'express';
// STRIPE
import Stripe from 'stripe';
const stripe = new Stripe(String(process.env.STRIPE_KEY), {
	apiVersion: '2020-03-02',
});
// INTERNALS
import UserService from '../../services/UserServices';
import {
	ErrorBase,
	AuthorizationError,
	UnexpectedError,
	FormatError,
	BodyError,
} from '../../core/apiErrors';
import User from '../../database/models/User';
import { getTokenFromHeader } from './utils';
import UserRepository from '../../database/repositories/userRepository';

class UserController {
	/** Set response to return */
	private static handleError(
		res: Response<ApiResponse>,
		error: any,
	): Response<ApiResponse> {
		if (error instanceof ErrorBase)
			return res.status(error.status).json({ error });
		else
			return res
				.status(500)
				.json({ error: new UnexpectedError(undefined, error) });
	}

	// GETS
	static async get(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		try {
			const response = await UserService.get(
				getTokenFromHeader(req),
				req.params.uuid,
			);
			return res.status(response.status).json(response);
		} catch (error) {
			return UserController.handleError(res, error);
		}
	}

	static async getWithBets(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		try {
			const response = await UserService.getWithBets(
				getTokenFromHeader(req),
				req.params.uuid,
			);
			return res.status(response.status).json(response);
		} catch (error) {
			return UserController.handleError(res, error);
		}
	}

	// UPDATES
	static async update(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		const { ...userProperties }: User = req.body;
		try {
			if (typeof userProperties.uuid == 'undefined')
				throw new BodyError('<uuid> is required in body');

			const response = await UserService.update(
				getTokenFromHeader(req),
				userProperties,
			);

			if (response)
				return res.status(200).json({
					status: 200,
					data: {
						message: `User with uuid ${userProperties.uuid} succesfully updated`,
					},
				});
			throw new FormatError('Incorrect keys in body');
		} catch (error) {
			return UserController.handleError(res, error);
		}
	}

	static async updatePwd(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		const { uuid, currentPwd, newPwd } = req.body;

		try {
			if (typeof uuid === undefined)
				throw new BodyError('<uuid> is required in body');
			if (typeof currentPwd === undefined)
				throw new BodyError('<currentPwd> is required in body');
			if (typeof newPwd === undefined)
				throw new BodyError('<newPwd> is required in body');

			const response = await UserService.updatePwd(
				getTokenFromHeader(req),
				uuid,
				currentPwd,
				newPwd,
			);

			if (response)
				return res.status(200).json({
					status: 200,
					data: {
						message: `Password of user with uuid ${uuid} succesfully updated`,
					},
				});
			throw new UnexpectedError();
		} catch (error) {
			return UserController.handleError(res, error);
		}
	}

	static async updateAvatar(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<void> {
		const imageUpload = User.storageService.uploadImg.single('file');

		imageUpload(req, res, async (err: { message: any }) => {
			if (err) {
				return res.status(422).send({
					error: {
						status: 422,
						name: 'Image Upload Error',
						message: 'Probably wrong file format',
						details: err.message,
					},
				});
			}

			const { uuid } = req.body;
			const avatar: string = req.file.location;

			try {
				const response = await UserService.updateAvatar(
					getTokenFromHeader(req),
					uuid,
					avatar,
				);
				return res.status(response.status).json(response);
			} catch (error) {
				return UserController.handleError(res, error);
			}
		});
	}

	// PAYMENTS
	static async createCustomer(
		name: string,
		email: string,
	): Promise<Stripe.Customer> {
		const params: Stripe.CustomerCreateParams = {
			name,
			email,
			source: 'tok_amex', // A ajouter via une route user ou demander à chaque fois? (peut etre plus simple pour une v1 / MVP)
		};

		return await stripe.customers.create(params); // !! Création d'un nouveau user (même si les infos sont identiques)
	}

	static async payAccountFromCustomer(
		fromCustomerId: string,
		toAccountId: string,
		amount: number,
	): Promise<void> {
		await stripe.charges.create({
			amount,
			currency: 'eur',
			customer: fromCustomerId, // TODO: ajouter customerId à User.ts
			destination: {
				account: toAccountId, // TODO: ajouter accountId à User.ts
			},
		});
	}

	// TODO: tester (pas sûr que ça fonctionne avec type de compte actuel)
	static async payAccountFromApp(
		toAccountId: string,
		amount: number,
	): Promise<void> {
		await stripe.charges.create({
			amount,
			currency: 'eur',
			customer: toAccountId, // TODO: ajouter customerId à User.ts
			source: process.env.appAccountId, // TODO: ajouter à .env
		});
	}

	// Retrieve Money --> directly from stripe website for V1 / MVP

	static async setNewAccountId(userId: string, code: string): Promise<void> {
		const authResponse = await stripe.oauth.token({
			grant_type: 'authorization_code',
			code,
		});
		if (typeof authResponse !== 'string') return; // vérifier exécution ; throw ?

		const userToUpdate = await UserRepository.instance.get({
			uuid: userId,
		});
		if (userToUpdate === undefined) return; // vérifier exécution ; throw ?
		if (
			userToUpdate.accountId !== null ||
			userToUpdate.accountId !== undefined
		)
			return; // vérifier exécution ; throw ?

		await UserRepository.instance.update(
			{ uuid: userId },
			{ accountId: String(authResponse) },
		);
	}

	static async charge(req: Request, res: Response<ApiResponse>) {
		try {
			// // ######## STEP : Treat auth response
			// const response = await stripe.oauth.token({
			// 	grant_type: 'authorization_code',
			// 	// code: 'ac_HLPCG9ffhZxrGX2gEER6BGraxB3ZXCne',
			// 	code: 'ac_HLPQNsmGFGz3WQ79KZKx64mWdFdcBFi5',
			// });

			// var connected_account_id = response.stripe_user_id;
			// console.log('connected account: ');
			// // console.log(connected_account_id); // ac_HLPCG9ffhZxrGX2gEER6BGraxB3ZXCne -> Response: acct_1GmiLjKtkqtaePkM
			// console.log(connected_account_id); // ac_HLPQNsmGFGz3WQ79KZKx64mWdFdcBFi5 -> Response: acct_1GmibABDLMt3AFNF

			// const customer = await UserController.createCustomer();
			// console.log('######### customer');
			// console.log(customer);

			// // ######## Supply "customer"/connected account
			// const chargeToAccount = await stripe.charges.create({
			// 	amount: 1000,
			// 	currency: 'eur',
			// 	// customer: customer.id,
			// 	customer: 'cus_HLOVO4vKH8yKN0',
			// 	destination: {
			// 		account: 'acct_1GmibABDLMt3AFNF', // account ID stored in Api DB - User.ts
			// 	},
			// });

			// // ######## DEBIT CONNECTED ACCOUNT --> only possible with express and cutom accounts...
			// const chargeFromAccount = await stripe.charges.create({
			// 	amount: 500,
			// 	currency: 'eur',
			// 	// customer: customer.id,
			// 	customer: 'cus_HLOVO4vKH8yKN0',
			// 	source: 'acct_1GmibABDLMt3AFNF',
			// });

			stripe.balance.retrieve((err, balance) => {
				console.log('########### balance');
				console.log(balance); // Pending : Not yet avalaible in the balance, due to the 7-day rolling pay cycle (https://stripe.com/docs/api/balance/balance_object)
			});
			// stripe.balance.retrieve((err, balance) => {
			// 	console.log('########### balance after second charge');
			// 	console.log(balance);
			// });

			// const updateCustomer = await stripe.customers.retrieve(customer.id);
			const updateCustomer = await stripe.customers.retrieve(
				'cus_HLOVO4vKH8yKN0',
			);
			console.log('updateCustomer');
			console.log(updateCustomer); // Balance n'est pas mis à jour (action pour valider le paiement?)

			const updatedAccount = await stripe.accounts.retrieve(
				'acct_1GmibABDLMt3AFNF',
			);
			console.log('updatedAccount');
			console.log(updatedAccount); // Balance n'est pas mis à jour (action pour valider le paiement?)

			const updatedAccountBalance = await stripe.balance.retrieve({
				stripe_account: 'acct_1GmibABDLMt3AFNF',
			});
			console.log('updatedAccount balance');
			console.log(updatedAccountBalance); // Balance n'est pas mis à jour (action pour valider le paiement?)
		} catch (err) {
			res.send(err);
		}
	}

	// DELETIONS
	static async delete(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		const { uuid } = req.params;

		try {
			if (typeof uuid == 'undefined')
				throw new BodyError('Uuid is required to delete any user');
			const response = await UserService.delete(
				getTokenFromHeader(req),
				uuid,
			);
			if (response)
				return res.status(200).json({
					status: 200,
					data: {
						message: `User with uuid ${uuid} succesfully deleted`,
					},
				});
			throw new UnexpectedError(
				'User with uuid ${uuid} cannot be deleted',
			);
		} catch (error) {
			return UserController.handleError(res, error);
		}
	}

	static async deleteAvatar(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		try {
			const result = await UserService.deleteAvatar(
				getTokenFromHeader(req),
				req.body.uuid,
				req.params.fileKey,
			);
			if (!result) throw new UnexpectedError();
			return res.status(200).json({
				status: 200,
				data: {
					message: 'Success - Image deleted from S3 or not existing',
				},
			});
		} catch (error) {
			return UserController.handleError(res, error);
		}
	}
}

export default UserController;
