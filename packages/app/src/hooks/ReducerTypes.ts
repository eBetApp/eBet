export interface IState {
  user?: string;
  avatar?: string;
}

export interface IAction {
  type: ReducerActions;
  payload: {
    user?: string;
    avatar?: string;
  };
}

export enum ReducerActions {
  register = "register",
  unregister = "unregister",
  changeAvatar = "changeAVatar",
}
