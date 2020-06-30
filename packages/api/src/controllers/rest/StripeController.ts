// EXPRESS
import { Request, Response } from 'express';
// STRIPE
import Stripe from 'stripe';
const stripe = new Stripe(String(process.env.STRIPE_KEY), {
	apiVersion: '2020-03-02',
});
// INTERNALS
import StripeService from '../../services/StripeServices';
import { ErrorBase, UnexpectedError } from '../../core/apiErrors';

class StripeController {
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

	static async payAccountFromCustomer(
		fromCustomerId: string,
		toAccountId: string,
		amount: number,
	): Promise<void> {
		await stripe.charges.create({
			amount,
			currency: 'eur',
			customer: fromCustomerId,
			destination: {
				account: toAccountId,
			},
		});
	}

	static async loadAccount(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		try {
			const { accountId, amount } = req.body;
			await StripeService.payAccountFromApp(accountId, amount);
			const newBalance = await stripe.balance.retrieve({
				stripeAccount: accountId,
			});
			return res.status(200).json({
				status: 200,
				data: {
					message: 'SUCCESS',
					newBalance: newBalance.available[0].amount,
				},
			});
		} catch (error) {
			return StripeController.handleError(res, error);
		}
	}

	static async getAccountBalance(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		try {
			const { accountId } = req.body;
			const balance = await StripeService.getAccountBalance(accountId);
			if (balance == null) throw new Error();
			return res.status(200).json({
				status: 200,
				data: {
					message: 'SUCCESS',
					balance: balance.available[0].amount,
				},
			});
		} catch (error) {
			return StripeController.handleError(res, error);
		}
	}

	static getCreateAccountUrl(
		req: Request,
		res: Response<ApiResponse>,
	): Response<ApiResponse> {
		return res.status(200).json({
			status: 200,
			data: {
				url: StripeService.getCreateAccountUrl(),
			},
		});
	}

	static async setAccount(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		try {
			const { uuid, code } = req.body; // CODE is obtained on connect.stripe url
			const newAccount = await StripeService.setNewAccountId(uuid, code);
			if (newAccount !== null) {
				return res.status(200).json({
					status: 200,
					data: {
						message: 'SUCCESS',
						accountId: newAccount,
					},
				});
			}
			throw new Error();
		} catch (error) {
			return StripeController.handleError(res, error);
		}
	}

	static async chargeCreditCard(req: Request, res: Response<ApiResponse>) {
		try {
			const { amount, source } = req.body;
			const chargeRes = await StripeService.chargeCreditCard(
				amount,
				'eur',
				source,
			);
			if (chargeRes)
				return res.status(200).json({
					status: 200,
					data: {
						message: 'SUCCESS',
					},
				});
			else throw new Error();
		} catch (error) {
			return StripeController.handleError(res, error);
		}
	}

	static async getProductSecret(req: Request, res: Response<ApiResponse>) {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: 500,
			currency: 'eur',
			metadata: { integration_check: 'accept_a_payment' },
		});

		return res.status(200).json({
			status: 200,
			data: {
				client_secret: paymentIntent.client_secret,
			},
		});
	}
}

export default StripeController;
