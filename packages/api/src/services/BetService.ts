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
import ApiDatas from './pandaScoreApi/apiDatas';

class BetServices {
	static async create(
		token: string | undefined,
		userUuid: string,
		idMatch: number,
		amount: number,
		idTeamBet: number
	): Promise<IApiResponseSuccess> {
		throwIfManipulateSomeoneElse(token, userUuid);

		// Retrieve user to update
		const userToUpdate = await UserRepository.instance.get({
			uuid: userUuid,
		});
		if (userToUpdate == undefined)
			throw new NotFoundError(`Uuid ${userUuid} : user not found`);

		const apiDatas = new ApiDatas();
		const upcomingMatch = apiDatas.getUpcomingMatchById(idMatch);

		if (upcomingMatch == undefined)
			throw new NotFoundError(`id ${idMatch} : match not found`);

		if (idTeamBet !== upcomingMatch.opponents[0].opponent.id && idTeamBet !== upcomingMatch.opponents[1].opponent.id)
			throw new NotFoundError(`idTeamBet ${idTeamBet} : idTeamBet not found`);

		// Prepare new bet
		const bet = new Bet();
		bet.user = userToUpdate;
		bet.amount = amount;
		bet.ended = false;
		bet.idMatch = idMatch;
		bet.idTournament = upcomingMatch.tournament_id;
		bet.idTeamBet = idTeamBet;
		bet.idWinner = undefined;
		bet.gameName = upcomingMatch.videogame.name;
		bet.tournamentName = upcomingMatch.tournament.name;
		bet.matchName = upcomingMatch.name;
		bet.team1 = upcomingMatch.opponents[0].opponent.name;
		bet.idTeam1 = upcomingMatch.opponents[0].opponent.id;
		bet.team2 = upcomingMatch.opponents[1].opponent.name;
		bet.idTeam2 = upcomingMatch.opponents[1].opponent.id;
		
		try {
			const { user, ...createdBet } = await BetRepository.instance.create(
				bet
			);
			return { status: 201, data: { bet: createdBet } };
		} catch (error) {
			throw new UnexpectedError(`Bet could not been created`, error);
		}
	}

	static async past(userUuid: string): Promise<IApiResponseSuccess> {
		try {
			// WIP
			return { status: 201, data: "WIP" };
		} catch (error) {
			console.log(error);
			throw new UnexpectedError(`Bet could not been created`, error);
		}
	}

	static async live(): Promise<IApiResponseSuccess> {
		try {
			const liveMatch = new ApiDatas().getliveMatch() as Match[];
			return { status: 201, data: liveMatch };
		} catch (error) {
			console.log(error);
			throw new UnexpectedError(`Bet could not been created`, error);
		}
	}

	static async upcoming(): Promise<IApiResponseSuccess> {
		try {
			const upcomingMatch = new ApiDatas().getUpcomingMatch() as Match[];
			return { status: 201, data: upcomingMatch };
		} catch (error) {
			console.log(error);
			throw new UnexpectedError(`Bet could not been created`, error);
		}
	}

	static async getBetByUser(
		userUuid: string
	): Promise<IApiResponseSuccess> {
		try {
			const bet = await BetRepository.instance.getByUser(userUuid);

			if (bet == undefined)
				throw new NotFoundError(`bet ${bet} : bet not found`);

			return { status: 201, data: bet };
		} catch (error) {
			console.log(error);
			throw new UnexpectedError(`Bet could not been created`, error);
		}
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

export default BetServices;
