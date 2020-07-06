// ENTITIES
interface IBet {
	uuid: string;
	amount: number;
	idMatch: number;
	idTournament: number;
	idTeamBet: number
	idWinner: number | undefined;
	gameName: string;
	tournamentName: string;
	matchName: string;
	team1: string;
	idTeam1: number;
	team2: string;
	idTeam2: number;
}

interface Match {
	id: number;
	name: string;
	begin_at: string;
	end_at?: string;
	games: Game[];
	opponents: Opponents[];
	tournament_id: number;
	videogame: VideoGame;
	tournament: Tournament;
	winner_id: number;
}

interface VideoGame {
	name: string;
}

interface Tournament {
	name: string;
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
	odd?: number;
}

interface Winner {
	id: number;
	name: string;
}

interface IUser {
	uuid: string;
	nickname: string;
	email: string;
	birthdate: Date;
	password: string;
	avatar?: string;
}

interface IErrorBase {
	status: number;
	name: string;
	message: string;
	details?: any;
	stack?: string;
}

// EXTENDED EXPRESS TYPES
declare namespace Express {
	namespace Multer {
		export interface File {
			location: string;
		}
	}
}

// SERVER RESPONSES
interface IApiResponseSuccess {
	status: number;
	data: {};
}

interface IApiResponseError {
	error: {
		status: number;
		name: string;
		message: string;
		details?: any;
		stack?: string;
	};
}

/** Format of all responses except these returning user */
type ApiResponse = IApiResponseSuccess | IApiResponseError;

interface IToken {
	token: string;
}
/** Authentication Responses returning user with token */
interface IAuthServiceResponse extends IApiResponseSuccess {
	status: number;
	data: {
		user: Omit<IUser, 'password'>;
	};
	meta: IToken;
}

/** Responses (when logged) returning user */
interface IUserServiceResponse extends IApiResponseSuccess {
	status: number;
	data: {
		user?: Omit<IUser, 'password'>;
	};
}
