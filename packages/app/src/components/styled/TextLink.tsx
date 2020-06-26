import React, { useContext } from "react";
import { Text } from "react-native-elements";
import { ThemeContext } from "react-native-elements";

export function TextLink(props) {
  const { theme } = useContext(ThemeContext);

  return (
    <Text
      {...props}
      style={{ color: theme.customColors.ternaryBgValid, textAlign: "center" }}
    />
  );
}
