import React, { createContext, useReducer, useContext } from "react";

import { IAction, ReducerActions, IState } from "./ReducerTypes";

const _initialState: IState = {
  user: null,
  avatar: "",
};

// REDUCER
const _reducer: React.Reducer<IState, IAction> = (
  state = _initialState,
  action
) => {
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
    case ReducerActions.edit:
      return {
        ...state,
        user: { ...state.user, ...action.payload.partialUser },
      };
    case ReducerActions.changeAvatar:
      return {
        ...state,
        avatar: action.payload.avatar,
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
  dispatch: () => {},
};
const _storeContext = createContext(_initContext);

export const StoreProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(_reducer, _initialState);

  return (
    <_storeContext.Provider value={{ state, dispatch }}>
      {children}
    </_storeContext.Provider>
  );
};

export const useStore = () => useContext(_storeContext);
