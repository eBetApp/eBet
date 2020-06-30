import { fetchPastMatch, fetchUpcomingMatch } from './apiFetchs';
import BetRepository from '../../database/repositories/BetRepository';
import Bet from '../../database/models/Bet';

interface GameEvent {
	game: string;
}

export default class ApiDatas {
	static instance: ApiDatas;

	private liveMatchIds: number[] = [];

	private pastMatch: Match[] = [];
	private liveMatch: Match[] = [];
	private upcomingMatch: Match[] = [];

	constructor() {
		if (ApiDatas.instance) {
			return ApiDatas.instance;
		}

		this.pastMatch = [];
		this.liveMatch = [];
		this.upcomingMatch = [];
		this.liveMatchIds = [];

		ApiDatas.instance = this;

		return this;
	}

	getPastMatch() {
		return this.pastMatch;
	}

	getliveMatch() {
		return this.liveMatch;
	}

	getUpcomingMatch() {
		return this.upcomingMatch;
	}

	getPastMatchById(id: number) {
		const match = this.pastMatch.find(item => item.id === id);
		return match;
	}

	getLiveMatchById(id: number) {
		const match = this.liveMatch.find(item => item.id === id);
		return match;
	}

	getUpcomingMatchById(id: number) {
		const match = this.upcomingMatch.find(item => item.id === id);
		return match;
	}

	chargePastMatch(pastMatchFile: any) {
		let newPastMatch: Match[] = [];

		pastMatchFile.forEach((match: Match) => {
			newPastMatch.push(match as Match);
		});

		this.pastMatch = newPastMatch;
		// console.log("past charged");
	}

	async chargeLiveMatch(liveMatchFile: any) {
		let newLiveMatch: Match[] = [];

		let newLiveMatchIds: number[] = [];

		liveMatchFile.forEach((itemEvent: { match: Match, event: GameEvent }) => {
			let { match, event } = itemEvent;

			match.videogame = {
				name: event.game
			};

			newLiveMatchIds.push(match.id);

			newLiveMatch.push(match);
		});

		if (this.liveMatchIds != newLiveMatchIds) {
			await fetchPastMatch();
			await fetchUpcomingMatch();

			let finishedBetList: Bet[] | undefined;

			for (const liveMatchId of this.liveMatchIds) {
				if (newLiveMatchIds.indexOf(liveMatchId) === -1) {
					finishedBetList = await BetRepository.instance.getByMatchId(liveMatchId);
				}
			}

			if (finishedBetList !== undefined) {
				finishedBetList.forEach(bet => {
					const endedMatch = this.getPastMatchById(bet.idMatch);
					if (endedMatch !== undefined) {
						bet.idWinner = endedMatch.winner_id;
						bet.ended = true;

						BetRepository.instance.create(bet);
					}
				});
			}

		}
		this.liveMatchIds = newLiveMatchIds;
		this.liveMatch = newLiveMatch;
	}

	chargeUpcomingMatch(upcomingMatchFile: any) {
		let newUpcomingMatch: Match[] = [];

		upcomingMatchFile.forEach((match: Match) => {
			newUpcomingMatch.push(match as Match);
		});

		this.upcomingMatch = newUpcomingMatch;
		// console.log("upcoming charged");
	}
}