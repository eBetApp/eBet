import React from "react";
import WebView from "react-native-webview";
// Navigation imports
import { ClaimScreenProps } from "../../Navigator/Stacks";

export default function ClaimWinningsScreen({ navigation }: ClaimScreenProps) {
  return (
    <WebView
      source={{
        uri: "https://dashboard.stripe.com/login",
      }}
    />
  );
}
