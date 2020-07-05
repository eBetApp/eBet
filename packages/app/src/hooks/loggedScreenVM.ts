// React imports
import { useRef, useState } from "react";
// Resources imports
import { localStorageItems, readStorageKey } from "../Resources";
// Redux imports
import { IAction, IState } from "../Redux/ReducerTypes";
import { dispatchUserEdit } from "../Redux/dispatchers";
// Hooks imports
import { useTextInput, useFetchAuth } from ".";
// Utils imports
import {
  AuthError,
  classifyAuthError,
  errorType,
} from "../Utils/parseApiError";
import { userService } from "../Services";

export const useEditUserFetch = (
  state: IState,
  dispatch: React.Dispatch<IAction>
) => {
  // States
  const useEmail = useTextInput(state.user?.email ?? "");
  const useNickname = useTextInput(state.user?.nickname ?? "");
  const [birthdate, setBirthdate] = useState(
    new Date(state.user?.birthdate).toDateString() ?? ""
  );

  // Ref
  const toastErrRef = useRef(null);
  const toastSuccessRef = useRef(null);

  const payload = {
    uuid: state.user?.uuid,
    email: useEmail.value,
    nickname: useNickname.value,
    birthdate: new Date(birthdate).toISOString(),
  };

  const { fetch, fetchIsProcessing, error } = useFetchAuth(
    new AuthError(),
    (setErr) => _preFetchRequest(setErr),
    async (setErr) => _fetchRequest(setErr),
    (res, err) => _handleFetchRes(res, err),
    (err) => _handleFetchErr(err)
  );

  const _preFetchRequest = (setError) =>
    birthdate !== null && birthdate !== undefined;

  const _fetchRequest = async (setError) => {
    const token = await readStorageKey(localStorageItems.token);
    return userService.updateAsync(payload, token);
  };

  const _handleFetchRes = (res, setError) => {
    if (res === null) {
      return toastErrRef.current.show("Network error");
    } else if ((res as IApiResponseSuccess)?.status === 200) {
      delete payload.uuid;
      dispatchUserEdit(dispatch, { ...payload });
      toastSuccessRef.current.show("👍 Update is done");
      setError(new AuthError());
    } else if ((res as IApiResponseError)?.error?.status === 400) {
      switch (classifyAuthError((res as IApiResponseError).error.message)) {
        case errorType.nickname:
          setError(new AuthError({ nickname: "Wrong format" }));
          break;
        case errorType.email:
          setError(new AuthError({ email: "Wrong format" }));
          break;
        case errorType.birthdate:
          setError(new AuthError({ birthdate: "Wrong format" }));
          break;
      }
    } else throw new Error();
  };

  const _handleFetchErr = (err: any) => {
    toastErrRef.current.show("Unexpected error");
    console.log("updateUserAsync() -- Unexpected error : ", error);
  };

  return {
    useEmail,
    useNickname,
    birthdate,
    setBirthdate,
    toastErrRef,
    toastSuccessRef,
    fetch,
    fetchIsProcessing,
    error,
  };
};
