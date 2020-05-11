// SERVER
import { Request, Response } from 'express';
// INTERNALS
import BetService from '../../services/BetService';
import {
	ErrorBase,
	AuthorizationError,
	UnexpectedError,
	FormatError,
	BodyError,
} from '../../core/apiErrors';
import User from '../../database/models/User';
import { getTokenFromHeader } from './utils';

class BetController {
	/** Set response to return */
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

	// GETS
	static async get(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		const { betUuid } = req.params;

		try {
			if (typeof betUuid !== 'string')
				throw new BodyError('<uuid> is required and must be a string');

			const response = await BetService.get(
				getTokenFromHeader(req),
				betUuid,
			);
			return res.status(response.status).json(response);
		} catch (error) {
			return BetController.handleError(res, error);
		}
	}

	static async create(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		const { name } = req.body;
		const { userUuid } = req.params;

		try {
			if (typeof userUuid !== 'string')
				throw new BodyError('<uuid> is required and must be a string');
			if (typeof name !== 'string')
				throw new BodyError('<name> is required and must be a string');

			const response = await BetService.create(
				getTokenFromHeader(req),
				userUuid,
				name,
			);
			return res.status(response.status).json(response);
		} catch (error) {
			return BetController.handleError(res, error);
		}
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
			const response = await BetService.delete(
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
			return BetController.handleError(res, error);
		}
	}
}

export default BetController;
