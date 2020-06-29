import React, { useContext } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";

export function MainView(props) {
  return <View {...props} style={{ ...props.style, margin: 5 }} />;
}

export function MainKeyboardAvoidingView(props) {
  return (
    <KeyboardAvoidingView
      {...props}
      behavior={Platform.OS == "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS == "android" ? -700 : 0}
      style={{ ...props.style, margin: 5 }}
    />
  );
}
