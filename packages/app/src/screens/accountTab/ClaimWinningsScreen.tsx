import React from "react";
import WebView from "react-native-webview";

export default function ClaimWinningsScreen() {
  return (
    <WebView
      source={{
        uri: "https://dashboard.stripe.com/login",
      }}
    />
  );
}
