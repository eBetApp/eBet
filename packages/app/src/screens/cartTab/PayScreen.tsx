import React, { useContext } from "react";
// .env imports
import { REACT_NATIVE_STRIPE_PK } from "react-native-dotenv";
// Resources imports
import { readStorageKey, localStorageItems } from "../../Resources";
// Services import
import { stripeService } from "../../Services";
// UI import
import { Icon, Text, ThemeContext } from "react-native-elements";
import { CreditCardInput } from "react-native-credit-card-input";
import { ButtonValid, MainView, Loader } from "../../components";
import { ScrollView } from "react-native-gesture-handler";
import { useFormInput, IForm } from "../../Hooks/useFormInput";
import { useFetchAuth } from "../../Hooks";
import { PayScreenProps } from "../../Navigator/Stacks";
// Stripe imports
// tslint:disable-next-line:no-var-requires
const stripeClient = require("stripe-client")(REACT_NATIVE_STRIPE_PK);

export default function PayScreen({ navigation, route }: PayScreenProps) {
  const { theme } = useContext(ThemeContext);
  const form = useFormInput(null);
  const { amount } = route.params;

  //#region FETCH PAYMENT
  const {
    fetch,
    fetchIsProcessing: paymentIsProcessing,
    error: paymentError,
  } = useFetchAuth(
    null,
    (setErr) => preFetchRequest(setErr),
    async (setErr) => fetchRequest(setErr),
    (res, err) => handleFetchRes(res, err),
    (err, setErr) => handleFetchErr(err, setErr)
  );

  const preFetchRequest = (setPaymentError) => {
    if (amount === null || amount === undefined) return false;
    if (!form?.data?.valid) {
      setPaymentError("Incomplete credentials");
      return false;
    }
    return true;
  };

  const fetchRequest = async (setPaymentError) => {
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

  const handleFetchRes = (res: ApiResponse, setPaymentError) => {
    if (res === null) setPaymentError("Network error");
    else if ((res as IApiResponseSuccess)?.status === 200) {
      navigation.goBack();
    } else throw new Error();
  };

  const handleFetchErr = (err: any, setPaymentError) => {
    setPaymentError("Failed to process");
    console.log("submitPayment() -- Unexpected error : ", err);
    console.log(err);
  };
  //#endregion FETCH PAYMENT

  return (
    <MainView>
      <ScrollView>
        <CreditCardInput
          {...form}
          allowScroll={true}
          invalidColor={theme.colors.error}
          labelStyle={{ color: theme.colors.secondary }}
          inputStyle={{ color: theme.colors.primary }}
          // onChange={(data) => setForm(data)}
        />
        <ButtonValid
          title="PAY"
          onPress={fetch}
          icon={
            <Icon name="ios-wallet" type="ionicon" size={15} color="#ffffff" />
          }
        />
        <Loader animating={paymentIsProcessing} />
        <Text
          style={{
            fontSize: 12,
            alignSelf: "center",
            color: theme.colors.error,
          }}
        >
          {paymentError}
        </Text>
      </ScrollView>
    </MainView>
  );
}
