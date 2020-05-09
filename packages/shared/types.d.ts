// ENTITIES
interface IUser {
	uuid: string;
	nickname: string;
	email: string;
	birthdate: Date;
	password: string;
	avatar?: string;
}

interface IErrorBase {
	status: number,
	name: string;
	message: string;
	details?: any;
	stack?: string;
}


// SERVER RESPONSES
interface IApiResponseSuccess {
	status: number,
	data: {};
}

interface IApiResponseError {
	error: {
		status: number,
		name: string;
		message: string;
		details?: any;
		stack?: string;
	}
}

/** Format of all responses except these returning user */
type ApiResponse = IApiResponseSuccess | IApiResponseError;

/** Authentication Responses returning user with token */
interface IAuthServiceResponse extends IApiResponseSuccess {
	status: number,
	data: {
		user: Omit<IUser, 'password'>;
	};
	meta: {
		token: string;
	};
}

/** Responses (when logged) returning user */
interface IUserServiceResponse extends IApiResponseSuccess {
	status: number,
	data: {
		user?: Omit<IUser, 'password'>;
	};
}
