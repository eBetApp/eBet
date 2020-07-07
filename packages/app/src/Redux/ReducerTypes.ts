export interface IState {
	user?: Omit<User, "password"> | null;
	balance?: number;
	bets?: number;
}

export interface IAction {
	type: ReducerActions;
	payload?: {
		user?: Omit<User, "password">;
		partialUser?: Partial<User>;
		balance?: number;
	};
}

export enum ReducerActions {
	register = "register",
	unregister = "unregister",
	editUser = "editUser",
	changeUserAccountBalance = "changeUserAccountBalance",
	eraseUserAccountBalance = "eraseUserAccountBalance",
	addBet = "abbBet",
}
