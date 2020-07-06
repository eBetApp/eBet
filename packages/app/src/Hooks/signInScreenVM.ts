// React imports
import { useEffect, useRef } from "react";
// Hooks imports
import { useFetch, useTextInput } from ".";
// Resources imports
import {
  readStorageKey,
  localStorageItems,
  setStorage,
  Navigation,
} from "../Resources";
import { SignInScreenProps } from "../Navigator/Stacks";
// Redux imports
import { dispatchUserNew } from "../Redux/dispatchers";
import { IAction } from "../Redux/ReducerTypes";
// Utils imports
import { userService } from "../Services";
import {
  AuthError,
  errorType,
  classifyAuthError,
} from "../Utils/parseApiError";

/** Invoked by useEffect on viewDidLoad */
export const useInitAuthFetch = (dispatch: React.Dispatch<IAction>) => {
  let token: string;
  let uuid: string;

  const { fetch, fetchIsProcessing } = useFetch(
    null,
    (setErr) => true,
    async (setErr) => _initFetchFromLocalStorageRequest(setErr),
    (res, err) => _handleinitFetchFromLocalStorageRes(res, err),
    (err) => {} // tslint:disable-line
  );

  const _initFetchFromLocalStorageRequest = async (setErr) =>
    userService.getUserAsync(uuid, token);

  const _handleinitFetchFromLocalStorageRes = (res, setError) => {
    if (res !== null && (res as IApiResponseSuccess)?.status === 200)
      dispatchUserNew(dispatch, (res as IApiResponseSuccess)?.data.user);
  };

  useEffect(() => {
    const tokenPromise = readStorageKey(localStorageItems.token);
    const uuidPromise = readStorageKey(localStorageItems.userUuid);
    Promise.all([tokenPromise, uuidPromise])
      .then((values) => ([token, uuid] = values))
      .then(() => {
        if (
          token === null ||
          token === undefined ||
          uuid === null ||
          uuid === undefined
        )
          return;
        fetch();
      });
  }, []);

  return { fetchIsProcessing };
};

/** Invoked by calling fetch() */
export const useSignInFetch = (
  dispatch: React.Dispatch<IAction>,
  { navigation }: SignInScreenProps
) => {
  // States
  const useEmail = useTextInput();
  const usePassword = useTextInput();

  // Ref
  const toastErrRef = useRef(null);

  const payload: ISignInPayload = {
    email: useEmail.value,
    password: usePassword.value,
  };

  const { fetch, fetchIsProcessing, error } = useFetch(
    new AuthError(),
    (setErr) => true,
    async (setErr) => _fetchRequest(setErr),
    (res, err) => _handleFetchRes(res, err),
    (err) => _handleFetchErr(err)
  );

  const _fetchRequest = (setErr) => userService.signInAsync(payload);

  const _handleFetchRes = (result: ApiResponse, setError) => {
    if (result === null) {
      setError(new AuthError());
      toastErrRef.current.show("Network error");
      return;
    } else if ((result as IAuthServiceResponse)?.status === 200) {
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
      navigation.navigate(Navigation.Screens.loggedHome);
    } else if ((result as IApiResponseError)?.error?.status === 400) {
      switch (classifyAuthError((result as IApiResponseError).error.message)) {
        case errorType.email:
          setError(
            new AuthError({
              email: (result as IApiResponseError).error.message,
            })
          );
          break;
        case errorType.password:
          setError(
            new AuthError({
              password: (result as IApiResponseError).error.message,
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
    console.log("signInAsync() -- Unexpected error : ", err);
  };

  return {
    useEmail,
    usePassword,
    toastErrRef,
    fetch,
    fetchIsProcessing,
    error,
  };
};
