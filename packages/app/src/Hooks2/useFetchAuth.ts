import { useState } from "react";

export const useFetchAuth = (
  initError,
  preFetchRequest: (setError) => boolean,
  fetchRequest: (err?: any) => Promise<any>,
  handleFetchRes: (res, setError) => any,
  handleFetchErr: (err) => any
) => {
  const [fetchIsProcessing, setFetchIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState(initError);

  const fetch = () => {
    if (fetchIsProcessing) return;
    if (!preFetchRequest(setError)) return;

    setFetchIsProcessing(true);
    fetchRequest(setError)
      .then((result) => handleFetchRes(result, setError))
      .catch((err) => handleFetchErr(err))
      .finally(() => setFetchIsProcessing(false));
  };

  return { fetch, fetchIsProcessing, error };
};
