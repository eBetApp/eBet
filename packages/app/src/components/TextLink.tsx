import React, { useContext } from "react";
// UI imports
import { Text } from "react-native-elements";
import { ThemeContext } from "react-native-elements";
import { CustomTheme } from "../Resources/Theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureResponderEvent } from "react-native";

interface IProps {
  onPress: (event: GestureResponderEvent) => void;
  text: string;
}

export function TextLink(props: IProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text
        style={{
          color: (theme as CustomTheme).customColors.ternaryBgValid,
          textAlign: "center",
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}
