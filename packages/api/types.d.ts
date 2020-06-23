// ENTITIES
interface IBet {
	uuid: string;
	amount: number;
	idMatch: number;
	idTournament: number;
	idTeamBet: number
	idWinner: number;
	game: string;
	team1: string;
	idTeam1: number;
	team2: string;
	idTeam2: number;
}

// EXTENDED EXPRESS TYPES
declare namespace Express {
	namespace Multer {
		export interface File {
			location: string;
		}
	}
}
