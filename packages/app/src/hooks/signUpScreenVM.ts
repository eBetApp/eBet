// React imports
import { useRef, useState } from "react";
// Resources imports
import { setStorage, localStorageItems } from "../Resources";
// Redux imports
import { IAction } from "../Redux/ReducerTypes";
import { dispatchUserNew } from "../Redux/dispatchers";
// Hooks imports
import { useTextInput, useFetchAuth } from ".";
// Utils imports
import {
  AuthError,
  classifyAuthError,
  errorType,
} from "../Utils/parseApiError";
import { userService } from "../Services";

export const useInitAuthFetch = (dispatch: React.Dispatch<IAction>) => {
  // States
  const useNickname = useTextInput();
  const useEmail = useTextInput();
  const usePassword = useTextInput();
  const [birthdate, setBirthdate] = useState(null);

  // Ref
  const pwdInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const toastErrRef = useRef(null);

  const payload: ISignUpPayload = {
    nickname: useNickname.value,
    email: useEmail.value,
    password: usePassword.value,
    birthdate: birthdate != null ? new Date(birthdate).toISOString() : null,
  };

  const { fetch, fetchIsProcessing, error } = useFetchAuth(
    new AuthError(),
    (setErr) => _preFetchRequest(setErr),
    async (setErr) => _fetchRequest(setErr),
    (res, err) => _handleFetchRes(res, err),
    (err) => _handleFetchErr(err)
  );

  const _preFetchRequest = (setErr) => {
    if (birthdate === null || birthdate === undefined) {
      setErr(new AuthError({ birthdate: "birthdate should not be empty" }));
      return false;
    }
    return true;
  };

  const _fetchRequest = async (setError) => userService.signUpAsync(payload);

  const _handleFetchRes = (result: ApiResponse, setError) => {
    if (result === null) {
      setError(new AuthError());
      return toastErrRef.current.show("Network error");
    } else if ((result as IAuthServiceResponse)?.status === 201) {
      dispatchUserNew(dispatch, (result as IAuthServiceResponse).data.user);
      setStorage(
        localStorageItems.token,
        (result as IAuthServiceResponse).meta.token
      );
      setStorage(
        localStorageItems.userUuid,
        (result as IAuthServiceResponse).data.user.uuid
      );
      setError(new AuthError());
    } else if ((result as IApiResponseError)?.error?.status === 400) {
      switch (classifyAuthError((result as IApiResponseError).error.message)) {
        case errorType.nickname:
          setError(
            new AuthError({
              nickname: (result as IApiResponseError).error?.message,
            })
          );
          break;
        case errorType.email:
          setError(
            new AuthError({
              email: (result as IApiResponseError).error?.message,
            })
          );
          break;
        case errorType.password:
          setError(
            new AuthError({
              password: (result as IApiResponseError).error?.message,
            })
          );
          break;
        case errorType.birthdate:
          setError(
            new AuthError({
              birthdate: (result as IApiResponseError).error?.message,
            })
          );
          break;
        default:
          break;
      }
    } else throw new Error();
  };

  const _handleFetchErr = (err: any) => {
    toastErrRef.current.show("Unexpected error");
    console.log("signUpAsync() -- Unexpected error : ", err);
  };

  return {
    setBirthdate,
    useNickname,
    useEmail,
    usePassword,
    emailInputRef,
    pwdInputRef,
    toastErrRef,
    fetch,
    fetchIsProcessing,
    error,
  };
};
