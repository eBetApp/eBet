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
			customer: fromCustomerId, // TODO: ajouter customerId à User.ts
			destination: {
				account: toAccountId, // TODO: ajouter accountId à User.ts
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
					newBalance: newBalance.available[0].amount, // TODO: voir pour parser résultats car tableau donc il doit y avoir des cas où plusieurs entrées au tableau (une pour chaque monnaie?)
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
					balance: balance.available[0].amount, // TODO: voir pour parser résultats car tableau donc il doit y avoir des cas où plusieurs entrées au tableau (une pour chaque monnaie?)
				},
			});
		} catch (error) {
			return StripeController.handleError(res, error);
		}
	}

	// TODO: déporter appel dans un service
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

	/* <req.body CODE> is returned by stripe on createAccount page -- cf getCreatAccountUrl()*/
	// TODO (côté client) Récupérer l'info "code" dans l'url en RESPONSE. Cette response est de la forme : https://connect.stripe.com/connect/default/oauth/test?scope=read_write&code=ac_HTFpocROTP8GX7IDWyEb2rpKVdNe6cYF // ATTENTION: souvent terminé par #
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

	// TODO: charge from customer to ebet service => comment faire pour la soure / numero de cb à passer???
	// ==> voir https://stripe.com/docs/payments/accept-a-payment#web
	// ==> voir https://docs.expo.io/versions/latest/sdk/payments/
	// ==> voir https://github.com/expo/stripe-expo
	// TODO: restreindre à des paiements en EURO uniquement !!
	// ==> Se passe probablement au niveau client avec méthodes déjà fournies par strip
	static async chargeCreditCard(req: Request, res: Response<ApiResponse>) {
		try {
			const { amount, currency, source } = req.body; // ATTENTION : La source (= numero cb) ne doit pas etre passé comme ça !!! COMMENT ??
			const chargeRes = await StripeService.chargeCreditCard(
				amount,
				currency,
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
