import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

// .env imports
import {
  REACT_NATIVE_STRIPE_PK,
  REACT_NATIVE_BACK_URL,
} from "react-native-dotenv";

// Fetch imports
import queryString from "query-string";

// Types imports
import { User } from "@shared/apiTypes/User"; // TODO: shared a été supprimé => ajouter dans les types de app

// Redux import
import { useStore } from "../hooks/store";
import { dispatchAvatar } from "../hooks/dispatchers";

// Services import
import userService from "../Services/userService";

// UI import
import { Button, Icon } from "react-native-elements";

// Stripe imports
var stripeClient = require("stripe-client")(REACT_NATIVE_STRIPE_PK);
import { CreditCardInput } from "react-native-credit-card-input";
import { useStripe } from "@stripe/react-stripe-js";

export default function PayView() {
  let _form;

  const _paymentInfos = (_form) => {
    const infos = {
      card: {
        number: _form?.values.number,
        exp_month: _form?.values.expiry.substr(0, 2),
        exp_year: _form?.values.expiry.substr(3, 5),
        cvc: _form?.values.cvc,
      },
    };
    return infos;
  };

  const _checkForm = (form) => {
    console.log("--- FORM");
    console.log(form);
    return form.valid;
  };

  const _handleForm: () => Promise<string | null> = async () => {
    if (!_checkForm(_form)) return null;

    var card = await stripeClient.createToken(_paymentInfos(_form));
    var token = card.id;
    return token;
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

  const onPayment = async () => {
    const formIsValid = await _handleForm();
    if (formIsValid == null) return;

    await _submitPayment(formIsValid);
  };

  const _updateForm = (form) => (_form = form);

  return (
    <View>
      <CreditCardInput
        allowScroll={true}
        onChange={(form) => _updateForm(form)}
      />
      <Button
        title="PAY"
        onPress={onPayment}
        icon={
          <Icon name="ios-wallet" type="ionicon" size={15} color="#ffffff" />
        }
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 2,
    borderColor: "white",
  },
  touchable: {
    width: 130,
    height: 130,
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 90,
  },
});
