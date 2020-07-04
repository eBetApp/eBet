// React imports
import React from "react";
import { View } from "react-native";
// Navigation imports
import { StackNavigationOptions } from "@react-navigation/stack";
// UI imports
import theme, { CustomTheme } from "../../Resources/Theme";
import { Badge, Avatar } from "react-native-elements";
// Redux imports
import { IState } from "../../Redux/ReducerTypes";
import { StackHeaderOptions } from "@react-navigation/stack/lib/typescript/src/types";
// Resources imports
import { Images } from "../../Resources";
// Utils imports
import { nFormatter } from "../../Utils/formatter";

export const commonNavScreenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: (theme as CustomTheme).customColors.secondaryBg,
  },
  headerTintColor: theme.colors.primary,
  cardStyle: { backgroundColor: (theme as CustomTheme).customColors.primaryBg },
};

export const headerOptionsWithBadge = (
  state: IState,
  localOptions?: StackHeaderOptions
): StackHeaderOptions => {
  return {
    ...localOptions,
    headerRight: () => {
      return (
        <>
          <Avatar rounded={true} source={Images.logo} size="medium" />
          {state.balance !== null && (
            <Badge
              value={`${nFormatter(state.balance, 1)} €`}
              status="warning"
              badgeStyle={{ marginRight: 2, padding: 2 }}
              containerStyle={{ position: "absolute", top: 5, right: 30 }}
            />
          )}
        </>
      );
    },
  };
};
export const headerOptionsWithoutBadge = (
  localOptions?: StackHeaderOptions
): StackHeaderOptions => {
  return {
    ...localOptions,
    headerRight: () => {
      return <Avatar rounded={true} source={Images.logo} size="medium" />;
    },
  };
};
