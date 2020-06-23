import { IAction, ReducerActions } from "./ReducerTypes";

export const dispatchNewUser = (
  dispatch: React.Dispatch<IAction>,
  user: User
) => {
  return dispatch({ type: ReducerActions.register, payload: { user } });
};

export const dispatchEditUser = (
  dispatch: React.Dispatch<IAction>,
  partialUser: Partial<User>
) => {
  return dispatch({ type: ReducerActions.edit, payload: { partialUser } });
};

export const dispatchVoidUser = (dispatch: React.Dispatch<IAction>) => {
  return dispatch({ type: ReducerActions.unregister });
};

export const dispatchAvatar = (
  dispatch: React.Dispatch<IAction>,
  avatarUri: string
) => {
  dispatch({
    type: ReducerActions.changeAvatar,
    payload: { avatar: avatarUri },
  });
};
