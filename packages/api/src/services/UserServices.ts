/** ****** TYPEORM ****** **/
import { QueryFailedError, UpdateResult } from 'typeorm'
/** ****** VALIDATOR ****** **/
import { ValidationError } from 'class-validator'
import { transformAndValidate } from 'class-transformer-validator'
/** ****** INTERNALS ****** **/
import User from '../database/models/User'
import UserRepository from '../database/repositories/UserRepository'
import { DatabaseError } from '../core/apiErrors'
import { throwIfManipulateSomeoneElse } from './utils'

class UserServices {
	static async getUser(
		token: string | undefined,
		uuid: string,
	): Promise<UserServiceResponse> {
		throwIfManipulateSomeoneElse(token, uuid)

		const res = await UserRepository.instance.get({ uuid })
		if (res == undefined)
			throw new DatabaseError(`Uuid ${uuid} : user not found`, 404)
		const { ...user } = res
		delete user.password
		return { status: 200, data: { user } }
	}

	/** Update everything from user except uuid and password */
	static async updateUser(
		token: string | undefined,
		partialUser: Partial<User>,
	): Promise<boolean> {
		const { uuid, ...dataToUpdate } = partialUser
		delete dataToUpdate.password

		if (typeof uuid == 'undefined') return false

		throwIfManipulateSomeoneElse(token, uuid)

		return transformAndValidate(User, partialUser, {
			validator: { skipMissingProperties: true },
		})
			.then(
				(): Promise<UpdateResult> =>
					UserRepository.instance.update({ uuid }, { ...dataToUpdate }),
			)
			.then((res): boolean => res.affected != 0)
			.catch(error => {
				if (error instanceof DatabaseError) throw error
				if (error instanceof QueryFailedError)
					throw new DatabaseError(error.message, 400, error.stack, error)
				if (Array.isArray(error) && error[0] instanceof ValidationError)
					throw new DatabaseError(`Incorrect format - property : ${error[0].property}`, 400, undefined, error)
				throw error
			})
	}

	/** Update user password only */
	static async updateUserPwd(
		token: string | undefined,
		uuid: string,
		currentPwd: string,
		newPwd: string,
	): Promise<boolean> {
		if (typeof uuid === 'undefined') return false

		throwIfManipulateSomeoneElse(token, uuid)

		try {
			// Check provided current password
			const userToUpdate = await UserRepository.instance.get({ uuid })
			if (userToUpdate === undefined)
				throw new DatabaseError('User not found', 404)
			if (!User.checkIfUnencryptedPasswordIsValid(userToUpdate, currentPwd))
				throw new DatabaseError('Wrong current password', 403)

			// Check format of new password
			userToUpdate.password = newPwd
			await transformAndValidate(
				User,
				{ password: newPwd },
				{
					validator: { skipMissingProperties: true },
				},
			)

			// Hash and update correct password
			User.hashPassword(userToUpdate)
			const res = await UserRepository.instance.update(
				{ uuid },
				{ password: userToUpdate.password },
			)
			return res.affected != 0
		} catch (error) {
			if (error instanceof DatabaseError) throw error
			if (error instanceof ValidationError)
				throw new DatabaseError('Invalid format of new password', 400)
			throw error
		}
	}

	/** Update user avatar and remove previous from AWS */
	static async updateAvatar(
		token: string | undefined,
		uuid: string,
		avatar: string,
	): Promise<UserServiceResponse> {
		throwIfManipulateSomeoneElse(token, uuid)

		const connection = UserRepository.instance.connection
		let updatedUser: User | undefined = undefined

		// Start sql transaction
		const queryRunner = connection.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()

		try {
			const initUser = await UserRepository.instance.get({ uuid })
			if (initUser == undefined) throw new Error()

			// Set updatedUser by cloning init without any reference
			updatedUser = Object.assign({}, initUser)
			updatedUser.avatar = avatar

			// Update user in DB
			await queryRunner.manager.update(User, uuid, { avatar })
			await queryRunner.commitTransaction()

			// If DB operation succeeded, we delete previous avatar from AWS if exists
			const prevFileKey = User.storageService.extractFileKeyFromUrl(
				initUser.avatar,
			)
			if (prevFileKey != null) User.storageService.deleteImg(prevFileKey)
		} catch (error) {
			// If DB operation failed, we rollback and delete new avatar from AWS if it has been uploaded
			const updatedFileKey = User.storageService.extractFileKeyFromUrl(avatar)
			if (updatedFileKey != null) User.storageService.deleteImg(updatedFileKey)
			await queryRunner.rollbackTransaction()
			await queryRunner.release()
			throw new DatabaseError('Failed to update avatar', 500)
		} finally {
			await queryRunner.release()
			const { ...userToReturn } = updatedUser!
			delete userToReturn.password
			return { status: 200, data: { user: userToReturn } }
		}
	}

	static async deleteUser(
		token: string | undefined,
		uuid: string,
	): Promise<boolean> {
		throwIfManipulateSomeoneElse(token, uuid)

		try {
			const res = await UserRepository.instance.delete(uuid)
			return res.affected != 0
		} catch (error) {
			return false
		}
	}

	static async deleteAvatar(
		token: string | undefined,
		uuid: string,
		fileKey: string,
	): Promise<boolean> {
		throwIfManipulateSomeoneElse(token, uuid)

		try {
			await UserRepository.instance.update({ uuid }, { avatar: undefined })
			await User.storageService.deleteImg(fileKey)
			return true
		} catch (error) {
			return false
		}
	}
}

export default UserServices
