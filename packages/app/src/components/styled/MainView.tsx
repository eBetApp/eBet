import React, { useContext } from "react";
import { View } from "react-native";

export function MainView(props) {
  return <View {...props} style={{ ...props.style, margin: 5 }} />;
}
