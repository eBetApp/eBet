// React imports
import React from "react";
import { TouchableOpacity, Text } from "react-native";

// Navigation imports
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";

// Screens imports
import MainScreen from "../screens/MainView";
import ShopScreen from "../screens/ShopView";
import PayScreen from "../screens/PayView";
import SignInScreen from "../screens/SignInView";
import SignUpScreen from "../screens/SignUpView";
import LoggedScreen from "../screens/LoggedView";
import PasswordScreen from "../screens/PasswordView";
import RetrieveMoneyScreen from "../screens/ClaimWinningsView";

// UI imports
import theme, { CustomTheme } from "./Theme";

// Redux imports
import { useStore } from "../hooks/store";
import { Badge } from "react-native-elements";
import { IState } from "../hooks/ReducerTypes";
import { StackHeaderOptions } from "@react-navigation/stack/lib/typescript/src/types";

//#region NAVIGATION CONSTANTS
export enum Tabs {
  store = "StoreTab",
  cart = "CartTab",
  account = "AccountTab",
}

export enum Screens {
  store = "Store",
  cart = "Cart",
  signIn = "Sign in",
  signUp = "Sign up",
  loggedHome = "My account",
  pay = "Pay",
  account = "Account",
  password = "Change my password",
  claimMoney = "Claim my winnings",
}
//#endregion NAVIGATION CONSTANTS

//#region COMMON NAVIGATION OPTIONS
const commonNavScreenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: (theme as CustomTheme).customColors.secondaryBg,
  },
  headerTintColor: theme.colors.primary,
  cardStyle: { backgroundColor: (theme as CustomTheme).customColors.primaryBg },
};

const headerRightOption = (
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
//#endregion COMMON NAVIGATION OPTIONS

//#region STACKS
const StoreStack = createStackNavigator();
export function StoreStackScreen({ navigation }) {
  const { state } = useStore();

  return (
    <StoreStack.Navigator screenOptions={commonNavScreenOptions}>
      <StoreStack.Screen
        name={Screens.store}
        options={() => headerRightOption(state)}
        component={MainScreen}
      />
    </StoreStack.Navigator>
  );
}

const ShopStack = createStackNavigator();
export function ShopStackScreen({ navigation }) {
  const { state } = useStore();

  return (
    <ShopStack.Navigator screenOptions={commonNavScreenOptions}>
      <ShopStack.Screen
        name={Screens.cart}
        component={ShopScreen}
        options={() => headerRightOption(state)}
      />
      <ShopStack.Screen name={Screens.pay} component={PayScreen} />
    </ShopStack.Navigator>
  );
}

const AccountStack = createStackNavigator();
export function AccountStackScreen() {
  const { state } = useStore();

  return (
    <AccountStack.Navigator screenOptions={commonNavScreenOptions}>
      {state.user == null ? (
        <>
          <AccountStack.Screen name={Screens.signIn} component={SignInScreen} />
          <AccountStack.Screen name={Screens.signUp} component={SignUpScreen} />
        </>
      ) : (
        <>
          <AccountStack.Screen
            name={Screens.loggedHome}
            options={() => headerRightOption(state)}
            component={LoggedScreen}
          />
          <AccountStack.Screen
            name={Screens.password}
            options={() => headerRightOption(state)}
            component={PasswordScreen}
          />
          <AccountStack.Screen
            name={Screens.claimMoney}
            component={RetrieveMoneyScreen}
          />
        </>
      )}
    </AccountStack.Navigator>
  );
}
//#endregion STACKS
