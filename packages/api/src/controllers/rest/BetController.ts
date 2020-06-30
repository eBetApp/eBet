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

	static async getByUser(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		const { userUuid } = req.params;

		try {
			if (typeof userUuid !== 'string')
				throw new BodyError('<userUuid> is required and must be a string');

			const response = await BetService.getBetByUser(
				userUuid
			);
			return res.status(response.status).json(response);
		} catch (error) {
			return BetController.handleError(res, error);
		}
	}

	static async past(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		const { userUuid } = req.params;

		try {
			if (typeof userUuid !== 'string')
				throw new BodyError('<uuid> is required and must be a string');

			const response = await BetService.past(userUuid);
			return res.status(response.status).json(response);
		} catch (error) {
			return BetController.handleError(res, error);
		}
	}

	static async live(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		try {
			const response = await BetService.live();
			return res.status(response.status).json(response);
		} catch (error) {
			return BetController.handleError(res, error);
		}
	}

	static async upcoming(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		try {
			const response = await BetService.upcoming();
			return res.status(response.status).json(response);
		} catch (error) {
			return BetController.handleError(res, error);
		}
	}

	static async create(
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> {
		let { idMatch, amount, idTeamBet } = req.body;
		const { userUuid } = req.params;

		try {
			if (typeof userUuid !== 'string')
				throw new BodyError('<uuid> is required and must be a string');
			if (typeof idMatch !== 'string' || isNaN(Number(idMatch)))
				throw new BodyError('<idMatch> is required and must be a number');
			if (typeof amount !== 'string' || isNaN(Number(amount)))
				throw new BodyError('<amount> is required and must be a number');
			if (typeof idTeamBet !== 'string' || isNaN(Number(idTeamBet)))
				throw new BodyError('<idTeamBet> is required and must be a number');

			idMatch = Number(idMatch);
			amount = Number(amount);
			idTeamBet = Number(idTeamBet);

			const response = await BetService.create(
				getTokenFromHeader(req),
				userUuid,
				idMatch,
				amount,
				idTeamBet
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
		const { betUuid } = req.params;

		try {
			if (typeof betUuid !== 'string')
				throw new BodyError(
					'<betUuid> is required and must be a string',
				);
			const response = await BetService.delete(
				getTokenFromHeader(req),
				betUuid,
			);
			if (response)
				return res.status(200).json({
					status: 200,
					data: {
						message: 'Bet succesfully deleted',
					},
				});
			throw new UnexpectedError('Bet cannot be deleted');
		} catch (error) {
			return BetController.handleError(res, error);
		}
	}
}

export default BetController;
