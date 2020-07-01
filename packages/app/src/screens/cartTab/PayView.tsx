import React, { useState, useContext } from "react";
// .env imports
import { REACT_NATIVE_STRIPE_PK } from "react-native-dotenv";
// Resources imports
import { readStorage, localStorageItems } from "../../Resources";
// Services import
import { stripeService } from "../../Services";
// UI import
import { Icon, Text, ThemeContext } from "react-native-elements";
import { CreditCardInput } from "react-native-credit-card-input";
import { ButtonValid, MainView, Loader } from "../../components/styled";
import { ScrollView } from "react-native-gesture-handler";
// Stripe imports
// tslint:disable-next-line:no-var-requires
const stripeClient = require("stripe-client")(REACT_NATIVE_STRIPE_PK);

interface IForm {
  valid: boolean;
  values: any;
  status: any;
}

export default function PayView({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [form, setForm] = useState<IForm>(null);
  const [paymentIsProcessing, setPaymentIsProcessing] = useState<boolean>(
    false
  );
  const [paymentError, setPaymentError] = useState<string>("");

  const handlePayment = async () => {
    const stripeToken = await _getPaymentToken();
    if (stripeToken !== null) await fetchPayment(stripeToken);
  };

  const _getPaymentToken: () => Promise<string | null> = async () => {
    if (!_checkPaymentInfosCompletion(form)) {
      setPaymentError("Incomplete credentials");
      return null;
    }

    const card = await stripeClient.createToken(_paymentInfos(form));
    const token = card.id;
    return token;
  };

  const _checkPaymentInfosCompletion = (_form: IForm) => _form.valid;

  const _paymentInfos = (_form: IForm) => {
    return {
      card: {
        number: form?.values.number,
        exp_month: form?.values.expiry.substr(0, 2),
        exp_year: form?.values.expiry.substr(3, 5),
        cvc: form?.values.cvc,
      },
    };
  };

  const fetchPayment = async (stripeToken) => {
    if (paymentIsProcessing) return;

    setPaymentIsProcessing(true);

    const payload = {
      amount: 2000,
      source: stripeToken,
    };

    const userToken = await readStorage(localStorageItems.token);

    stripeService
      .postPaymentAsync(payload, userToken)
      .then((res) => {
        if (res === null) setPaymentError("Network error");
        else if ((res as IApiResponseSuccess)?.status === 200) {
          navigation.goBack();
        } else throw new Error();
      })
      .catch((error) => {
        setPaymentError("Failed to process");
        console.log("submitPayment() -- Unexpected error : ", error);
      })
      .finally(() => setPaymentIsProcessing(false));
  };

  return (
    <MainView>
      <ScrollView>
        <CreditCardInput
          allowScroll={true}
          invalidColor={theme.colors.error}
          labelStyle={{ color: theme.colors.secondary }}
          inputStyle={{ color: theme.colors.primary }}
          onChange={(data) => setForm(data)}
        />
        <ButtonValid
          title="PAY"
          onPress={handlePayment}
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
