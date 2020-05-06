export class DatabaseError extends Error {
	public status: number;
	public details: any;
	constructor(
		message: string,
		status: number,
		stack?: string,
		details?: any,
	) {
		super(message);
		this.name = 'DatabaseError';
		this.stack = stack;
		this.status = status;
		this.details = details;
	}
}

export class EndpointAccessError extends Error {
	public status: number;
	constructor(
		message: string = 'Only operations on its own user are allowed!',
		stack?: string,
	) {
		super(message);
		this.name = 'AccessError';
		this.stack = stack;
		this.status = 403;
	}
}
