import User from '../database/models/User';
import { AuthorizationError, NotFoundError } from '../core/apiErrors';
import Bet from '../database/models/Bet';
import BetRepository from '../database/repositories/BetRepository';

export const throwIfManipulateSomeoneElse = (
	token: string | undefined,
	userUuid: string,
): void => {
	if (typeof token == 'undefined')
		throw new AuthorizationError('Token is undefined');
	if (!User.tokenBelongsToUser(token, userUuid))
		throw new AuthorizationError('Token and uuid provided do not match');
};

export const throwIfManipulateForeignBet = async (
	token: string | undefined,
	betUuid: string,
): Promise<Bet> => {
	// Check token
	if (typeof token == 'undefined')
		throw new AuthorizationError('Token is undefined');
	const user = User.getUserFromToken(token);
	if (user === undefined)
		throw new AuthorizationError('No user found with provided token');

	// Check bet
	const bet = await BetRepository.instance.get({ uuid: betUuid });

	if (bet === undefined)
		throw new NotFoundError('No bet found with provided uuid');

	// Check bet belongs to user provided by token
	if (bet.user.uuid !== user.uuid)
		throw new AuthorizationError('Token and uuid provided do not match');

	return bet;
};
