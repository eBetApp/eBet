// React imports
import React from "react";
// Navigation imports
import { StackNavigationOptions } from "@react-navigation/stack";
// UI imports
import theme, { CustomTheme } from "../../Resources/Theme";
import { Badge } from "react-native-elements";
// Redux imports
import { IState } from "../../Redux/ReducerTypes";
import { StackHeaderOptions } from "@react-navigation/stack/lib/typescript/src/types";

export const commonNavScreenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: (theme as CustomTheme).customColors.secondaryBg,
  },
  headerTintColor: theme.colors.primary,
  cardStyle: { backgroundColor: (theme as CustomTheme).customColors.primaryBg },
};

export const headerRightOption = (
  state: IState,
  localOptions?: StackHeaderOptions
) => {
  return {
    ...localOptions,
    headerRight: () => {
      if (state.balance !== null)
        return (
          <Badge
            value={`${state.balance} €`}
            status="warning"
            badgeStyle={{ marginRight: 5, padding: 5 }}
          />
        );
    },
  };
};
