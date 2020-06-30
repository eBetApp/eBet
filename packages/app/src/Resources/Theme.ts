// React imports
import React from "react";

// UI imports
import { FullTheme } from "react-native-elements";
import Palette from "./Palette";

export interface CustomTheme extends Partial<FullTheme> {
  customColors?: {
    readonly primaryBg?: string;
    readonly secondaryBg?: string;
    readonly ternaryBgValid?: string;
    readonly ternaryBgCancel?: string;
    readonly ternaryBgEdit?: string;
    readonly ternaryBg4?: string;
  };
}

const theme: CustomTheme = {
  customColors: {
    primaryBg: Palette.primaryBg,
    secondaryBg: Palette.secondaryBg,
    ternaryBgValid: Palette.ternaryBgValid,
    ternaryBgCancel: Palette.ternaryBgCancel,
    ternaryBgEdit: Palette.ternaryBgEdit,
  },
  colors: {
    primary: Palette.primaryText,
    secondary: Palette.secondaryText,
    error: Palette.errorText,
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
  Icon: {
    color: Palette.primaryText,
  },
};

export default theme;
