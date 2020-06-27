import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

// .env imports
import {
  REACT_NATIVE_STRIPE_PK,
  REACT_NATIVE_BACK_URL,
} from "react-native-dotenv";

// Fetch imports
import queryString from "query-string";

// Redux import
import { useStore } from "../hooks/store";

// Services import
import userService from "../Services/userService";

// UI import
import { Button, Icon } from "react-native-elements";

// Stripe imports
var stripeClient = require("stripe-client")(REACT_NATIVE_STRIPE_PK);
import { CreditCardInput } from "react-native-credit-card-input";

export default function PayView() {
  let _form;

  const _updateForm = (form) => (_form = form);

  const _handlePayment = async () => {
    const formIsValid = await _getPaymentToken();
    if (formIsValid == null) return;
    await _submitPayment(formIsValid);
  };

  const _getPaymentToken: () => Promise<string | null> = async () => {
    if (!_checkPaymentInfosCompletion(_form)) return null;

    var card = await stripeClient.createToken(_paymentInfos(_form));
    var token = card.id;
    return token;
  };

  const _checkPaymentInfosCompletion = (form) => form.valid;

  const _paymentInfos = (_form) => {
    return {
      card: {
        number: _form?.values.number,
        exp_month: _form?.values.expiry.substr(0, 2),
        exp_year: _form?.values.expiry.substr(3, 5),
        cvc: _form?.values.cvc,
      },
    };
  };

  const _submitPayment = async (token) => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYmY0NjA1ODUtMTVjNy00OTRiLTkzYmYtMDUwNzE4YjVlZGM0Iiwibmlja25hbWUiOiJiZW4zIiwiZW1haWwiOiJiZW4zQGdtYWlsLmNvbSIsImlhdCI6MTU5MjQ5NTk1OH0.ptYaBoWoqIm3kF8Gf8MpR4zZ42SEXdzPCPJhH1HOEnE"
    );
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const payload = {
      amount: 2000,
      currency: "eur",
      source: token,
    };

    var requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: queryString.stringify(payload),
    };

    fetch(`${REACT_NATIVE_BACK_URL}/api/payments/charge`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  return (
    <View>
      <CreditCardInput
        allowScroll={true}
        onChange={(form) => _updateForm(form)}
      />
      <Button
        title="PAY"
        onPress={_handlePayment}
        icon={
          <Icon name="ios-wallet" type="ionicon" size={15} color="#ffffff" />
        }
      />
    </View>
  );
}
