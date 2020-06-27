// React imports
import React from "react";

// UI imports
import { Icon, ThemeProvider, Theme } from "react-native-elements";
import Palette from "../Resources/Palette";
import Ionicons from "react-native-vector-icons/Ionicons";
import { State } from "react-native-gesture-handler";
import { StackHeaderOptions } from "@react-navigation/stack/lib/typescript/src/types";
import { IState } from "../hooks/ReducerTypes";

interface CustomTheme extends Theme {
  customColors?: {
    readonly primaryBg?: string;
    readonly secondaryBg?: string;
    readonly ternaryBgValid?: string;
    readonly ternaryBgCancel?: string;
    readonly ternaryBg3?: string;
    readonly ternaryBg4?: string;
  };
}

const theme: CustomTheme = {
  customColors: {
    primaryBg: Palette.primaryBg,
    secondaryBg: Palette.secondaryBg,
    ternaryBgValid: Palette.ternaryBgValid,
    ternaryBgCancel: Palette.ternaryBgCancel,
    ternaryBg3: Palette.ternaryBg3,
  },
  colors: {
    primary: Palette.primaryText,
    secondary: Palette.secondaryText,
  },
  Text: {
    style: {
      color: Palette.primaryText,
    },
  },
  Input: {
    placeholderTextColor: Palette.primaryText,
    keyboardAppearance: "dark",
    inputStyle: {
      color: Palette.primaryText,
    },
  },
};

export default theme;
