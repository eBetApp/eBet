// import { FullTheme } from "react-native-elements";

// ENTITIES
interface User {
  uuid: string;
  nickname: string;
  email: string;
  birthdate: string;
  password: string;
  avatar?: string;
  customerId?: string;
  accountId?: string;
}

interface IErrorBase {
  status: number;
  name: string;
  message: string;
  details?: any;
  stack?: string;
}

// SERVER RESPONSES
interface IApiResponseSuccess {
  status: number;
  data: { [key: string]: any };
}

interface IApiMatchResponseSuccess {
  status: number;
  data: [];
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
    user: Omit<User, "password">;
  };
  meta: IToken;
}

/** Responses (when logged) returning user */
interface IUserServiceResponse extends IApiResponseSuccess {
  status: number;
  data: {
    user?: Omit<User, "password">;
  };
}

interface IMatchServiceResponse extends IApiMatchResponseSuccess {
  status: number;
  data: Match[];
}

// Match
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
	name: string;
}
