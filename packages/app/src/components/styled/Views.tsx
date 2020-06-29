import React, { useContext } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function MainView(props) {
  return (
    <SafeAreaView {...props} style={{ ...props.style, flex: 1, margin: 5 }} />
  );
}

export function MainKeyboardAvoidingView(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        {...props}
        behavior={Platform.OS == "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS == "android" ? -700 : 0}
        style={{ ...props.style, margin: 5 }}
      />
    </SafeAreaView>
  );
}
