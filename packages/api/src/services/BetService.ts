/** ****** TYPEORM ****** **/
import { UpdateResult } from 'typeorm';
/** ****** VALIDATOR ****** **/
import { ValidationError, validate } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';
/** ****** INTERNALS ****** **/
import Bet from '../database/models/Bet';
import BetRepository from '../database/repositories/BetRepository';
import {
	ErrorBase,
	NotFoundError,
	AuthorizationError,
	FormatError,
	UnexpectedError,
} from '../core/apiErrors';
import {
	throwIfManipulateSomeoneElse,
	throwIfManipulateForeignBet,
} from './utils';
import UserRepository from '../database/repositories/userRepository';
import User from '../database/models/User';

class UserServices {
	static async create(
		token: string | undefined,
		userUuid: string,
		name: string,
	): Promise<IApiResponseSuccess> {
		throwIfManipulateSomeoneElse(token, userUuid);

		// Retrieve user to update
		const userToUpdate = await UserRepository.instance.get({
			uuid: userUuid,
		});
		if (userToUpdate == undefined)
			throw new NotFoundError(`Uuid ${userUuid} : user not found`);

		// Prepare new bet
		const bet = new Bet();
		bet.name = name;
		bet.user = userToUpdate;

		const errors: ValidationError[] = await validate(bet);
		if (errors.length > 0)
			throw new FormatError(Object.values(errors[0].constraints)[0]);

		// Create new bet
		const { user, ...createdBet } = await BetRepository.instance.create(
			bet,
		);
		return { status: 201, data: { bet: createdBet, user: user.email } };
	}

	static async get(
		token: string | undefined,
		betUuid: string,
	): Promise<IApiResponseSuccess> {
		const { user, ...bet } = await throwIfManipulateForeignBet(
			token,
			betUuid,
		);
		return { status: 200, data: { bet } };
	}

	static async delete(
		token: string | undefined,
		betUuid: string,
	): Promise<boolean> {
		await throwIfManipulateForeignBet(token, betUuid);

		try {
			const res = await BetRepository.instance.delete(betUuid);
			return res.affected != 0;
		} catch (error) {
			return false;
		}
	}
}

export default UserServices;
