// STRIPE
import Stripe from 'stripe';
const stripe = new Stripe(String(process.env.STRIPE_KEY), {
	apiVersion: '2020-03-02',
});
// INTERNALS
import UserRepository from '../database/repositories/userRepository';

class AuthService {
	// TODO: voir si utile ici aussi
	// static setToken(user: User): string {
	// 	const { uuid, nickname, email } = user;
	// 	return jwt.sign({ uuid, nickname, email }, String(process.env.SECRET));
	// }

	static getCreateAccountUrl = (): string =>
		'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_HLOVRxlYXifqJlpAxypmnbp3OPhd8dXU&scope=read_write';

	static async createCustomer(
		name: string,
		email: string,
	): Promise<Stripe.Customer> {
		const params: Stripe.CustomerCreateParams = {
			name,
			email,
			source: 'tok_amex', // TODO: A ajouter via une route user ou demander à chaque fois? (peut etre plus simple pour une v1 / MVP)
		};

		return await stripe.customers.create(params);
	}

	/* 	Doc: https://stripe.com/docs/connect/add-and-pay-out-guide 
		Doc supported currency : https://stripe.com/docs/currencies
		NB : Retrieve Money from account --> directly from stripe website for MVP */
	static async payAccountFromApp(
		toAccountId: string,
		amount: number,
	): Promise<void> {
		await stripe.transfers.create({
			amount,
			currency: 'eur', // TODO: n'accepter que les paiements en euro (pas trouvé comment gérer plusieurs monnaies pour un même compte)
			destination: toAccountId,
		});
	}

	// TODO: move into service
	static async setNewAccountId(
		userUuid: string,
		code: string,
	): Promise<boolean> {
		try {
			const authResponse = await stripe.oauth.token({
				grant_type: 'authorization_code',
				code,
			});
			if (typeof authResponse === undefined) return false;

			const userToUpdate = await UserRepository.instance.get({
				uuid: userUuid,
			});
			if (userToUpdate === undefined || userToUpdate.accountId !== null)
				return false; // user does not exist OR its account already exists

			await UserRepository.instance.update(
				{ uuid: userUuid },
				{ accountId: String(authResponse.stripe_user_id) },
			);
			console.log('AccountId: ', String(authResponse.stripe_user_id));
			return true;
		} catch (e) {
			return false;
		}
	}

	// DOC: https://stripe.com/docs/api/charges/create
	static async chargeCreditCard(
		amount: number,
		currency: string,
		source: string,
	): Promise<boolean> {
		try {
			await stripe.charges.create({
				amount,
				currency,
				source,
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	static async getAccountBalance(
		accountId: string,
	): Promise<Stripe.Balance | null> {
		try {
			return await stripe.balance.retrieve({ stripeAccount: accountId });
		} catch (e) {
			return null;
		}
	}
}

export default AuthService;
