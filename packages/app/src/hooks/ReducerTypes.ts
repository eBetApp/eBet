export interface IState {
  user?: User | null;
  avatar?: string;
}

export interface IAction {
  type: ReducerActions;
  payload?: {
    user?: User;
    partialUser?: Partial<User>;
    avatar?: string;
  };
}

export enum ReducerActions {
  register = "register",
  unregister = "unregister",
  edit = "edit",
  changeAvatar = "changeAVatar",
}
