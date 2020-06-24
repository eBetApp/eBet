interface Match {
	id: number;
	name: string;
	begin_at: string;
	end_at?: string;
	games: Game[];
	opponents: Opponents[]
}

interface Game {
	status: string;
	winner: Winner;
}

interface Opponents {
	opponent: Opponent;
}

interface Opponent {
	id: number;
	image_url: string;
	name: string;
}

interface Winner {
	id: number;
}

export default class ApiDatas {
	static instance: ApiDatas;

	private pastMatch: Match[] = [];
	private liveMatch: Match[] = [];
	private upcomingMatch: Match[] = [];

	constructor() {
		if (!!ApiDatas.instance) {
			return ApiDatas.instance;
		}

		this.pastMatch = [];
		this.liveMatch = [];
		this.upcomingMatch = [];

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
	}

	chargeLiveMatch(liveMatchFile: any) {
		let newLiveMatch: Match[] = [];

		liveMatchFile.forEach((event: any) => {
			const { match } = event;
			newLiveMatch.push(match as Match);
		});

		this.liveMatch = newLiveMatch;
	}

	chargeUpcomingMatch(upcomingMatchFile: any) {
		let newUpcomingMatch: Match[] = [];

		upcomingMatchFile.forEach((match: Match) => {
			newUpcomingMatch.push(match as Match);
		});

		this.upcomingMatch = newUpcomingMatch;
	}
}