import { useFetchAuth } from ".";
import { useEffect } from "react";
import { readStorageKey, localStorageItems } from "../Resources";
import { userService } from "../Services";
import { dispatchUserNew } from "../Redux/dispatchers";
import { IAction } from "../Redux/ReducerTypes";

export const useInitAuthFetch = (dispatch: React.Dispatch<IAction>) => {
  let token: string;
  let uuid: string;

  const { fetch, fetchIsProcessing } = useFetchAuth(
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
