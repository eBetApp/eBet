// SERVER
import { Request, Response } from 'express';
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

class UserController {
	/** Set response to return */
	private static handleError(
		res: Response<ApiResponse>,
		error: any,
	): Response<ApiResponse> {
		if (error instanceof ErrorBase)
			return res.status(error.status).json({ error });
		else return res.status(500).json({ error: new UnexpectedError(undefined, error) });
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
						message: `User with uuid ${userProperties.uuid} succesfully updated`
					}
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
			return res
				.status(200)
				.json({
					status: 200,
					data: {
						message:
							'Success - Image deleted from S3 or not existing',
					},
				});
		} catch (error) {
			return UserController.handleError(res, error);
		}
	}
}

export default UserController;
