export interface IState {
  user?: User | null;
}

export interface IAction {
  type: ReducerActions;
  payload?: {
    user?: User;
    partialUser?: Partial<User>;
  };
}

export enum ReducerActions {
  register = "register",
  unregister = "unregister",
  editUser = "editUser",
}
