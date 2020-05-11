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
import { captureRejectionSymbol } from 'events';

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
	private static async createCustomer(): Promise<Stripe.Customer> {
		const params: Stripe.CustomerCreateParams = {
			description: 'test customer',
			name: 'BOB',
			email: 'BOB@gmail.com',
			source: 'tok_amex',
		};

		const customer: Stripe.Customer = await stripe.customers.create(params);
		return customer;
	}

	static async charge(req: Request, res: Response<ApiResponse>) {
		try {
			const customer = await UserController.createCustomer();
			console.log('######### customer');
			console.log(customer);

			const charge = await stripe.charges.create({
				amount: 1000,
				currency: 'eur',
				customer: customer.id,
			});

			console.log('########### charge');
			console.log(charge);

			// const updateCustomer = await stripe.customers.retrieve(customer.id);
			// console.log('updateCustomer');
			// console.log(updateCustomer); // Balance n'est pas mis à jour (action pour valider le paiement?)

			stripe.balance.retrieve((err, balance) => {
				console.log('########### balance');
				console.log(balance); // Pending : Not yet avalaible in the balance, due to the 7-day rolling pay cycle (https://stripe.com/docs/api/balance/balance_object)
			});

			await stripe.charges.create({
				amount: 2000,
				currency: 'eur',
				customer: customer.id,
			});

			stripe.balance.retrieve((err, balance) => {
				console.log('########### balance after second charge');
				console.log(balance);
			});
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
