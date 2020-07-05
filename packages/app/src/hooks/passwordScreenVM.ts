// React imports
import { useRef } from "react";
// Resources imports
import { localStorageItems, readStorageKey } from "../Resources";
import { PasswordScreenProps } from "../Navigator/Stacks";
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

/** Invoked on calling fetch() */
export const useEditPwdFetch = (
  state: IState,
  dispatch: React.Dispatch<IAction>,
  { navigation }: PasswordScreenProps
) => {
  // States
  const useCurrentPassword = useTextInput("");
  const useNewPassword = useTextInput("");
  const useNewPasswordConfirmation = useTextInput("");

  // Refs
  const toastErrRef = useRef(null);

  const payload: IPwdUpdatePayload = {
    uuid: state.user.uuid,
    currentPwd: useCurrentPassword.value,
    newPwd: useNewPassword.value,
  };

  const { fetch, fetchIsProcessing, error } = useFetchAuth(
    new AuthError(),
    (setErr) => _preFetchRequest(setErr),
    async (setErr) => _fetchRequest(setErr),
    (res, err) => _handleFetchRes(res, err),
    (err) => _handleFetchErr(err)
  );

  const _preFetchRequest = (setError) => {
    if (useNewPassword.value !== useNewPasswordConfirmation.value) {
      setError(
        new AuthError({
          newPassword: "Doesn't match",
          newPasswordConfirmation: "Doesn't match",
        })
      );
      return false;
    }
    return true;
  };

  const _fetchRequest = async (setError) => {
    const token = await readStorageKey(localStorageItems.token);
    return userService.updatePwdAsync(payload, token);
  };

  const _handleFetchRes = (res, setError) => {
    if (res === null) {
      setError(new AuthError());
      return toastErrRef.current.show("Network error");
    } else if ((res as IApiResponseSuccess)?.status === 200) {
      delete payload.uuid;
      dispatchUserEdit(dispatch, { ...payload });
      navigation.goBack();
    } else if (
      (res as IApiResponseError)?.error?.status === 400 &&
      classifyAuthError((res as IApiResponseError).error.message) ===
        errorType.password
    ) {
      setError(
        new AuthError({
          newPassword: (res as IApiResponseError).error.message,
        })
      );
    } else if (
      (res as IApiResponseError)?.error?.status === 403 &&
      classifyAuthError((res as IApiResponseError).error.message) ===
        errorType.password
    ) {
      setError(
        new AuthError({
          password: (res as IApiResponseError).error.message,
        })
      );
    } else throw new Error();
  };

  const _handleFetchErr = (err: any) => {
    toastErrRef.current.show("Unexpected error");
    console.log("update password -- Unexpected error : ", err);
  };

  return {
    useCurrentPassword,
    useNewPassword,
    useNewPasswordConfirmation,
    toastErrRef,
    fetch,
    fetchIsProcessing,
    error,
  };
};
