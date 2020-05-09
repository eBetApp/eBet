/** ****** TYPEORM ****** **/
import { QueryFailedError, UpdateResult } from 'typeorm';
/** ****** VALIDATOR ****** **/
import { ValidationError } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';
/** ****** INTERNALS ****** **/
import User from '../database/models/User';
import UserRepository from '../database/repositories/UserRepository';
import {
	ErrorBase,
	NotFoundError,
	AuthorizationError,
	FormatError,
	UnexpectedError,
} from '../core/apiErrors';
import { throwIfManipulateSomeoneElse } from './utils';

class UserServices {
	static async get(
		token: string | undefined,
		uuid: string,
	): Promise<IUserServiceResponse> {
		throwIfManipulateSomeoneElse(token, uuid);

		const user = await UserRepository.instance.get({ uuid });
		if (user == undefined)
			throw new NotFoundError(`Uuid ${uuid} : user not found`);
		delete user.password;
		return { status: 200, data: { user } };
	}

	/** Update everything from user except uuid and password */
	static async update(
		token: string | undefined,
		partialUser: Partial<User>,
	): Promise<boolean> {
		const { uuid, ...dataToUpdate } = partialUser;
		delete dataToUpdate.password;

		if (typeof uuid == 'undefined') return false;

		throwIfManipulateSomeoneElse(token, uuid);

		return transformAndValidate(User, partialUser, {
			validator: { skipMissingProperties: true },
		})
			.then(
				(): Promise<UpdateResult> =>
					UserRepository.instance.update(
						{ uuid },
						{ ...dataToUpdate },
					),
			)
			.then((res): boolean => res.affected != 0)
			.catch(error => {
				if (error instanceof ErrorBase) throw error;
				if (Array.isArray(error) && error[0] instanceof ValidationError)
					throw new FormatError(
						`Incorrect format - property : ${error[0].property}`,
						error,
					);
				throw new UnexpectedError(undefined, error);
			});
	}

	/** Update user password only */
	static async updatePwd(
		token: string | undefined,
		uuid: string,
		currentPwd: string,
		newPwd: string,
	): Promise<boolean> {
		if (typeof uuid === 'undefined') return false;

		throwIfManipulateSomeoneElse(token, uuid);

		try {
			// Check provided current password
			const userToUpdate = await UserRepository.instance.get({ uuid });
			if (userToUpdate === undefined)
				throw new NotFoundError('User not found');
			if (
				!User.checkIfUnencryptedPasswordIsValid(
					userToUpdate,
					currentPwd,
				)
			)
				throw new AuthorizationError('Wrong current password');

			// Check format of new password
			userToUpdate.password = newPwd;
			await transformAndValidate(
				User,
				{ password: newPwd },
				{
					validator: { skipMissingProperties: true },
				},
			);

			// Hash and update correct password
			User.hashPassword(userToUpdate);
			const res = await UserRepository.instance.update(
				{ uuid },
				{ password: userToUpdate.password },
			);
			return res.affected != 0;
		} catch (error) {
			if (error instanceof ErrorBase) throw error;
			if (error.length > 0 && error[0] instanceof ValidationError)
				throw new FormatError(Object.values(error[0].constraints)[0]);
			if (error instanceof ValidationError)
				throw new FormatError('Invalid format of new password', 400);
			throw new UnexpectedError();
		}
	}

	/*eslint no-unsafe-finally: "off"*/
	/** Update user avatar and remove previous from AWS */
	static async updateAvatar(
		token: string | undefined,
		uuid: string,
		avatar: string,
	): Promise<IUserServiceResponse> {
		throwIfManipulateSomeoneElse(token, uuid);

		const connection = UserRepository.instance.connection;
		let updatedUser: User | undefined = undefined;

		// Start sql transaction
		const queryRunner = connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const initUser = await UserRepository.instance.get({ uuid });
			if (initUser == undefined)
				throw new NotFoundError(`User with uuid ${uuid} not found`);

			// Set updatedUser by cloning init without any reference
			updatedUser = Object.assign({}, initUser);
			updatedUser.avatar = avatar;

			// Update user in DB
			await queryRunner.manager.update(User, uuid, { avatar });
			await queryRunner.commitTransaction();

			// If DB operation succeeded, we delete previous avatar from AWS if exists
			const prevFileKey = User.storageService.extractFileKeyFromUrl(
				initUser.avatar,
			);
			if (prevFileKey != null) User.storageService.deleteImg(prevFileKey);
		} catch (error) {
			// If DB operation failed, we rollback and delete new avatar from AWS if it has been uploaded
			const updatedFileKey = User.storageService.extractFileKeyFromUrl(
				avatar,
			);
			if (updatedFileKey != null)
				User.storageService.deleteImg(updatedFileKey);
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
			if (error instanceof ErrorBase) throw error;
			throw new UnexpectedError('Failed to update avatar');
		} finally {
			await queryRunner.release();
			const { ...userToReturn } = updatedUser!;
			delete userToReturn.password;
			return { status: 200, data: { user: userToReturn } };
		}
	}

	static async delete(
		token: string | undefined,
		uuid: string,
	): Promise<boolean> {
		throwIfManipulateSomeoneElse(token, uuid);

		try {
			const res = await UserRepository.instance.delete(uuid);
			return res.affected != 0;
		} catch (error) {
			return false;
		}
	}

	static async deleteAvatar(
		token: string | undefined,
		uuid: string,
		fileKey: string,
	): Promise<boolean> {
		throwIfManipulateSomeoneElse(token, uuid);

		try {
			await UserRepository.instance.update(
				{ uuid },
				{ avatar: undefined },
			);
			await User.storageService.deleteImg(fileKey);
			return true;
		} catch (error) {
			return false;
		}
	}
}

export default UserServices;
