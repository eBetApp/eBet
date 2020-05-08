import User from '../database/models/User'
import { AuthorizationError } from '../core/apiErrors'

export const throwIfManipulateSomeoneElse = (
	token: string | undefined,
	userUuid: string,
): void => {
	if (typeof token == 'undefined') throw new AuthorizationError('Token is undefined')
	if (!User.tokenBelongsToUser(token, userUuid)) throw new AuthorizationError('Token and uuid provided do not match')
}
