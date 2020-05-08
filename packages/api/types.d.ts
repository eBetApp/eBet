// ENTITIES
interface IUser {
	uuid: string;
	nickname: string;
	email: string;
	password: string;
	avatar?: string;
}

// TYPES
interface IApiResponseSuccess {
	status: number,
	data: {};
}

interface IApiErrorBase {
	status: number,
	name: string;
	message: string;
	details?: any;
	stack?: string;
}

interface IApiResponseError {
	error: IApiErrorBase;
}

interface IToken {
	token: string;
}

type ApiResponse = IApiResponseSuccess | IApiResponseError;

interface IAuthServiceResponse extends IApiResponseSuccess {
	status: number,
	data: {
		user: Omit<IUser, 'password'>;
	};
	meta: IToken;
}

// TODO: util???
interface IUserServiceResponse extends IApiResponseSuccess {
	status: number,
	data: {
		user?: Omit<IUser, 'password'>;
	};
}

// EXTENDED EXPRESS TYPES
declare namespace Express {
	namespace Multer {
		export interface File {
			location: string;
		}
	}
}
