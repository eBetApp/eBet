import React, { useState, useContext } from "react";

// .env imports
import { REACT_NATIVE_STRIPE_PK } from "react-native-dotenv";

// LocalStorage imports
import { readStorage } from "../Utils/asyncStorage";

// Services import
import betService from "../Services/betService";

// UI import
import { Icon, Text, ThemeContext } from "react-native-elements";
import { CreditCardInput } from "react-native-credit-card-input";
import { ButtonValid } from "../components/styled/Buttons";
import { MainView } from "../components/styled/Views";
import { ScrollView } from "react-native-gesture-handler";
import { Loader } from "../components/styled/Loader";

// Stripe imports
var stripeClient = require("stripe-client")(REACT_NATIVE_STRIPE_PK);

export default function PayView({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [form, setForm] = useState({
    card: {
      number: "",
      exp_month: "",
      exp_year: "",
      cvc: "",
    },
  });
  const [paymentIsProcessing, setPaymentIsProcessing] = useState<boolean>(
    false
  );
  const [paymentError, setPaymentError] = useState<string>("");

  const handlePayment = async () => {
    const stripeToken = await _getPaymentToken();
    if (stripeToken !== null) await _submitPayment(stripeToken);
  };

  const _getPaymentToken: () => Promise<string | null> = async () => {
    if (!_checkPaymentInfosCompletion(form)) {
      setPaymentError("Incomplete credentials");
      return null;
    }

    var card = await stripeClient.createToken(_paymentInfos(form));
    var token = card.id;
    return token;
  };

  const _checkPaymentInfosCompletion = (form) => form.valid;

  const _paymentInfos = (form) => {
    return {
      card: {
        number: form?.values.number,
        exp_month: form?.values.expiry.substr(0, 2),
        exp_year: form?.values.expiry.substr(3, 5),
        cvc: form?.values.cvc,
      },
    };
  };

  const _submitPayment = async (stripeToken) => {
    if (paymentIsProcessing) return;

    setPaymentIsProcessing(true);

    const payload = {
      amount: 2000,
      currency: "eur",
      source: stripeToken,
    };

    const userToken = await readStorage("token");

    betService
      .postPaymentAsync(payload, userToken)
      .then((res) => {
        if (res === null) setPaymentError("Network error");
        else if (res?.status === 200) {
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
