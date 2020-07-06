// tslint:disable:no-var-requires
// React imports
import { useState } from "react";
// Hooks imports
import { useFetch } from ".";
// Resources imports
import { readStorageKey, localStorageItems } from "../Resources";
import { PayScreenProps } from "../Navigator/Stacks";
// Utils imports
import { stripeService } from "../Services";
// Stripe imports
import { REACT_NATIVE_STRIPE_PK } from "react-native-dotenv";
import { useFormInput, IForm } from "./useFormInput";
const stripeClient = require("stripe-client")(REACT_NATIVE_STRIPE_PK);

/** Invoked on calling fetch() */
export const useInitAuthFetch = ({ navigation }: PayScreenProps) => {
  const [amount, setAmount] = useState<number>();
  const form = useFormInput(null);

  const { fetch, fetchIsProcessing, error } = useFetch(
    null,
    (setErr) => preFetchRequest(setErr),
    async (setErr) => fetchRequest(setErr),
    (res, err) => handleFetchRes(res, err),
    (err, setErr) => handleFetchErr(err, setErr)
  );

  const preFetchRequest = (setError) => {
    if (amount === null || amount === undefined) return false;
    if (!form?.data?.valid) {
      setError("Incomplete credentials");
      return false;
    }
    return true;
  };

  const fetchRequest = async (setError) => {
    const stripeToken = await _getPaymentToken();
    if (stripeToken !== null) return await _submitFetch(stripeToken);
  };

  const _getPaymentToken: () => Promise<string | null> = async () => {
    const card = await stripeClient.createToken(_paymentInfos(form?.data));
    const token = card.id;
    return token;
  };

  const _paymentInfos = (_form: IForm) => {
    return {
      card: {
        number: form?.data?.values.number,
        exp_month: form?.data?.values.expiry.substr(0, 2),
        exp_year: form?.data?.values.expiry.substr(3, 5),
        cvc: form?.data?.values.cvc,
      },
    };
  };

  const _submitFetch = async (stripeToken: string) => {
    const payload = {
      amount,
      source: stripeToken,
    };

    const userToken = await readStorageKey(localStorageItems.token);

    return stripeService.postPaymentAsync(payload, userToken);
  };

  const handleFetchRes = (res: ApiResponse, setError) => {
    if (res === null) setError("Network error");
    else if ((res as IApiResponseSuccess)?.status === 200) {
      navigation.goBack();
    } else throw new Error();
  };

  const handleFetchErr = (err: any, setError) => {
    setError("Failed to process");
    console.log("submitPayment() -- Unexpected error : ", err);
    console.log(err);
  };

  return { setAmount, form, fetch, fetchIsProcessing, error };
};
