import React, { useContext } from "react";
// UI imports
import { Text } from "react-native-elements";
import { ThemeContext } from "react-native-elements";
import { CustomTheme } from "../Resources/Theme";

export function TextLink(props) {
  const { theme } = useContext(ThemeContext);

  return (
    <Text
      {...props}
      style={{
        ...props.style,
        color: (theme as CustomTheme).customColors.ternaryBgValid,
        textAlign: "center",
      }}
    />
  );
}
