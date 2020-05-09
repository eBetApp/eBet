// EXPRESS
import { Request, Response } from 'express';
// INTERNALS
import AuthService from '../../services/AuthServices';
import { ErrorBase, UnexpectedError } from '../../core/apiErrors';

class AuthController {
	static signup = async (
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> => {
		const { nickname, password, email } = req.body;
		try {
			const result = await AuthService.signup(nickname, password, email);
			return res.status(result.status).json(result);
		} catch (error) {
			if (error instanceof ErrorBase) {
				return res.status(error.status).send({ error });
			}
			return res
				.status(500)
				.send({ error: new UnexpectedError('SignUp failed', error) });
		}
	};

	static signin = async (
		req: Request,
		res: Response<ApiResponse>,
	): Promise<Response<ApiResponse>> => {
		try {
			const result = await AuthService.signin(req, res);
			return res.status(result.status).json(result);
		} catch (error) {
			if (error instanceof ErrorBase)
				return res.status(error.status).send({ error });
			return res
				.status(500)
				.send({ error: new UnexpectedError('SignIn failed', error) });
		}
	};
}
export default AuthController;
