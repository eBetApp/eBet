export abstract class ErrorBase implements IErrorBase {
	public status: number;
	public name: string;
	public message: string;
	public details: any;
	public stack: any;
	
	constructor(
		message: string,
		status: number,
		details?: any,
		stack?: string,
	) {
		this.name = 'ApiError';
		this.message = message;
		this.stack = stack;
		this.status = status;
		this.details = details;
	}
}

/** Status 403 */
export class AuthorizationError extends ErrorBase {
	constructor(
		message: string,
		details?: any,
		stack?: string,
	) {
		super(message, 403, stack, details);
		this.name = 'Forbidden';
		this.stack = stack;
	}
}

/** Status 400 */
export class FormatError extends ErrorBase {
	constructor(
		message: string,
		details?: any,
		stack?: string,
	) {
		super(message, 400, stack, details);
		this.name = 'FormatError';
		this.stack = stack;
	}
}
export class BodyError extends ErrorBase {
	constructor(
		message: string,
		details?: any,
		stack?: string,
	) {
		super(message, 400, stack, details);
		this.name = 'FormatError';
		this.stack = stack;
	}
}

/** Status 404 */
export class NotFoundError extends ErrorBase {
	constructor(
		message: string,
		details?: any,
		stack?: string,
	) {
		super(message, 404, stack, details);
		this.name = 'NotFoundError';
		this.stack = stack;
	}
}

/** Status 500 */
export class UnexpectedError extends ErrorBase {
	constructor(
		message: string = "",
		details?: any,
		stack?: string,
	) {
		super(message, 500, stack, details);
		this.name = 'UnexpectedError';
		this.stack = stack;
	}
}
