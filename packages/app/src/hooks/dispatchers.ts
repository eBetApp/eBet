import { IAction, ReducerActions, IState } from "./ReducerTypes";

export const dispatchUserNew = (
  dispatch: React.Dispatch<IAction>,
  user: Omit<User, "password">
) => {
  return dispatch({ type: ReducerActions.register, payload: { user } });
};

export const dispatchUserEdit = (
  dispatch: React.Dispatch<IAction>,
  partialUser: Partial<User>
) => {
  return dispatch({ type: ReducerActions.editUser, payload: { partialUser } });
};

export const dispatchUserNull = (dispatch: React.Dispatch<IAction>) => {
  return dispatch({ type: ReducerActions.unregister });
};

export const dispatchUserAccountBalance = (
  dispatch: React.Dispatch<IAction>,
  balance: number
) => {
  return dispatch({
    type: ReducerActions.changeUserAccountBalance,
    payload: { balance },
  });
};

export const dispatchUserAccountBalanceNull = (
  dispatch: React.Dispatch<IAction>
) => {
  return dispatch({ type: ReducerActions.eraseUserAccountBalance });
};
