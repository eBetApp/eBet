import React, { createContext, useReducer, useContext } from "react";

import { IAction, ReducerActions, IState } from "./ReducerTypes";

const _initialState: IState = {
	user: null,
	balance: null,
	bets: 0,
};

// REDUCER
const _reducer: React.Reducer<IState, IAction> = (state = _initialState, action) => {
	switch (action.type) {
		case ReducerActions.register:
			return {
				...state,
				user: action.payload.user,
			};
		case ReducerActions.unregister:
			return {
				...state,
				user: null,
			};
		case ReducerActions.editUser:
			return {
				...state,
				user: { ...state.user, ...action.payload.partialUser },
			};
		case ReducerActions.changeUserAccountBalance:
			return {
				...state,
				balance: action.payload.balance,
			};
		case ReducerActions.eraseUserAccountBalance:
			return {
				...state,
				balance: null,
			};
		case ReducerActions.addBet:
			return {
				...state,
				bets: Number(state.bets) + 1,
			};
		default:
			return state;
	}
};

// STORE
const _initContext: {
	state: IState;
	dispatch: React.Dispatch<IAction>;
} = {
	state: _initialState,
	// tslint:disable-next-line:no-empty
	dispatch: () => {},
};
const _storeContext = createContext(_initContext);

export const StoreProvider = ({ children }: any) => {
	const [state, dispatch] = useReducer(_reducer, _initialState);

	return <_storeContext.Provider value={{ state, dispatch }}>{children}</_storeContext.Provider>;
};

export const useStore = () => useContext(_storeContext);
