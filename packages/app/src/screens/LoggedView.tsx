import React, { useState } from "react";
import { View } from "react-native";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchUserNull, dispatchUserEdit } from "../hooks/dispatchers";

// UI imports
import { Text } from "react-native-elements";
import { ButtonValid, ButtonCancel } from "../components/styled/Buttons";

// Fetch imports
import queryString from "query-string";

// .env imports
import { REACT_NATIVE_BACK_URL } from "react-native-dotenv";

// webView import
import { WebView } from "react-native-webview";

// utils import
import parseUrl from "../Utils/parseUrl";

// LocalStorage imports
import { readStorage, removeStorage } from "../Utils/asyncStorage";

// Components imports
import Avatar from "../components/Avatar";

export default function LoggedView({ navigation }) {
  const { dispatch, state } = useStore();
  let stripeAccount = "";

  const _renderWebView = () => (
    <WebView
      source={{
        uri:
          "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_HLOVRxlYXifqJlpAxypmnbp3OPhd8dXU&scope=read_write",
      }}
      onNavigationStateChange={(navState) => {
        const params = parseUrl(navState.url);
        if (params?.code !== undefined && params?.code != stripeAccount) {
          stripeAccount = params?.code;
          _createStripeAccount(stripeAccount);
        }
      }}
    />
  );

  const _renderLoggedView = () => (
    <View>
      <Avatar />
      <ButtonCancel
        title="LOG OUT"
        onPress={() => {
          dispatchUserNull(dispatch);
          removeStorage("token");
        }}
      />
    </View>
  );

  const _createStripeAccount = async (code: string) => {
    const token = await readStorage("token");

    const myHeaders = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    });

    const payload = {
      uuid: state.user.uuid,
      code,
    };

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: queryString.stringify(payload),
    };

    fetch(`${REACT_NATIVE_BACK_URL}/api/payments/set-account`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        dispatchUserEdit(dispatch, { accountId: result?.data?.accountId });
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <>
      {state.user?.accountId != null ? _renderLoggedView() : _renderWebView()}
    </>
  );
}
