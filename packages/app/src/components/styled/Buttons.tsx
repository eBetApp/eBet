import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-elements";
import Palette from "../../Res/Palette";
export function ButtonValid(props) {
  return (
    <Button
      buttonStyle={{ backgroundColor: Palette.ternaryBgValid }}
      {...props}
    />
  );
}

export function ButtonCancel(props) {
  return (
    <Button
      buttonStyle={{ backgroundColor: Palette.ternaryBgCancel }}
      {...props}
    />
  );
}
