// SERVER
import { Request, Response } from 'express'
// INTERNALS
import UserService from '../../services/UserServices'
import { DatabaseError, EndpointAccessError } from '../../core/apiErrors'
import User from '../../database/models/User'
import { getTokenFromHeader } from './utils'

class UserController {

	// GETS
	static async getUser(req: Request, res: Response): Promise<Response> {
		try {
			const response = await UserService.getUser(
				getTokenFromHeader(req),
				req.params.uuid,
			)
			return res.status(response.status).json({ user: response.data.user })
		} catch (error) {
			if (error instanceof DatabaseError)
				return res
					.status(error.status)
					.json({ message: error.message, error: error.details })
			if (error instanceof EndpointAccessError)
				return res
					.status(error.status)
					.json({ error: { message: error.message } })
			else return res.status(500).json({ message: 'Unexpected error', error })
		}
	}

	// UPDATES
	static async updateUser(req: Request, res: Response): Promise<Response> {
		const { ...userProperties }: User = req.body

		if (typeof userProperties.uuid == 'undefined')
			return res
				.status(403)
				.json({ error: 'Uuid is required to edit any user' })

		try {
			const response = await UserService.updateUser(
				getTokenFromHeader(req),
				userProperties,
			)

			if (response)
				return res.status(200).json({
					success: `User with uuid ${userProperties.uuid} succesfully updated`,
				})
			throw new Error('Incorrect keys in body')
		} catch (error) {
            console.log("ERROR")
            console.log(error)
			if (error instanceof EndpointAccessError)
				return res
					.status(error.status)
					.json({ error: { message: error.message } })
			if (error instanceof DatabaseError)
				return res
					.status(error.status)
					.json({ error: { message: error.message, details: error.details } })
			return res.status(500).json({
				error: `Unexpected error: User with uuid ${userProperties.uuid} cannot be updated`,
				details: error.message || error,
			})
		}
	}

	static async updateUserPwd(req: Request, res: Response): Promise<Response> {
		const { uuid, currentPwd, newPwd } = req.body
		if (
			typeof uuid === 'undefined' ||
			typeof currentPwd === 'undefined' ||
			typeof newPwd === 'undefined'
		)
			return res
				.status(400)
				.json({ error: 'Uuid - currentPw and newPwd are required in body' })

		try {
			const response = await UserService.updateUserPwd(
				getTokenFromHeader(req),
				uuid,
				currentPwd,
				newPwd,
			)

			if (response)
				return res.status(200).json({
					success: `Password of user with uuid ${uuid} succesfully updated`,
				})
			throw new Error('Incorrect keys in body')
		} catch (error) {
			if (error instanceof EndpointAccessError)
				return res
					.status(error.status)
					.json({ error: { message: error.message } })
			if (error instanceof DatabaseError)
				return res
					.status(error.status)
					.json({ error: { message: error.message, details: error.details } })
			return res.status(500).json({
				error: `Unexpected error: Password of user with uuid ${uuid} cannot be updated`,
				details: error.message || error,
			})
		}
	}

	static async updateAvatar(req: Request, res: Response): Promise<void> {
		const imageUpload = User.storageService.uploadImg.single('file')

		imageUpload(req, res, async (err: { message: any }) => {
			if (err) {
				return res.status(422).send({
					error: 'Image Upload Error',
					details: err.message,
				})
			}

			const { uuid } = req.body
			const avatar: string = req.file.location

			try {
				const response = await UserService.updateAvatar(
					getTokenFromHeader(req),
					uuid,
					avatar,
				)
				return res.status(response.status).json({ user: response.data.user })
			} catch (error) {
				if (error instanceof DatabaseError)
					return res
						.status(error.status)
						.json({ error: error.message, details: error.details })
				if (error instanceof EndpointAccessError)
					return res
						.status(error.status)
						.json({ error: { message: error.message } })
				return res
					.status(500)
					.json({ error: 'Unexpected error', details: error })
			}
		})
	}

	// DELETIONS
	static async deleteUser(req: Request, res: Response): Promise<Response> {
		const { uuid } = req.params

		if (typeof uuid == 'undefined')
			return res
				.status(400)
				.json({ error: 'Uuid is required to delete any user' })

		try {
			const response = await UserService.deleteUser(
				getTokenFromHeader(req),
				uuid,
			)
			return response
				? res
						.status(200)
						.json({ success: `User with uuid ${uuid} succesfully deleted` })
				: res.status(500).json({
						message: `Error: User with uuid ${uuid} cannot be deleted`,
					})
		} catch (error) {
			if (error instanceof EndpointAccessError)
				return res
					.status(error.status)
					.json({ error: { message: error.message } })
			return res.status(500).json({
				error: `Unexpected error: User with uuid ${uuid} cannot be deleted`,
				details: error,
			})
		}
	}

	static async deleteAvatar(req: Request, res: Response): Promise<Response> {
		try {
			const result = await UserService.deleteAvatar(
				getTokenFromHeader(req),
				req.body.uuid,
				req.params.fileKey,
			)
			if (!result) throw new Error()
			return res.status(200).json({
				message: 'Success - Image deleted from S3 or not existing',
			})
		} catch (error) {
			if (error instanceof DatabaseError)
				return res
					.status(error.status)
					.json({ message: error.message, error: error.details })
			if (error instanceof EndpointAccessError)
				return res
					.status(error.status)
					.json({ error: { message: error.message } })
			else return res.status(500).json({ message: 'error', error })
		}
	}
}

export default UserController
