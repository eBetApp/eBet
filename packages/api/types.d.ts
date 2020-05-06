/********************************
 * Define Server Response types *
 ********************************/
interface BaseResponse {
	status: number;
}

interface Token {
	token: string;
}

interface IUser {
	uuid: string;
	nickname: string;
	email: string;
	password: string;
	avatar?: string | undefined;
}

interface AuthServiceResponse extends BaseResponse {
	data: {
		user: Omit<IUser, 'password'>;
	};
	meta: Token;
}

interface UserServiceResponse extends BaseResponse {
	data: {
		user?: Omit<IUser, 'password'>;
	};
}

/********************
 * Extended Express types *
 ********************/
declare namespace Express {
	namespace Multer {
		export interface File {
			location: string;
		}
	}
}
