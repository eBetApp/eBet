export interface IState {
  user?: Omit<User, "password"> | null;
}

export interface IAction {
  type: ReducerActions;
  payload?: {
    user?: Omit<User, "password">;
    partialUser?: Partial<User>;
  };
}

export enum ReducerActions {
  register = "register",
  unregister = "unregister",
  editUser = "editUser",
}
