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
}

interface Winner {
	id: number;
}

// EXTENDED EXPRESS TYPES
declare namespace Express {
	namespace Multer {
		export interface File {
			location: string;
		}
	}
}
