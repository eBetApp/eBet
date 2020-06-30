// React imports
import React from "react";
import { TouchableOpacity } from "react-native";

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

// UI imports
import theme, { CustomTheme } from "./Theme";

// Redux imports
import { useStore } from "../hooks/store";

//#region NAVIGATION CONSTANTS
export enum Tabs {
  store = "StoreTab",
  cart = "CartTab",
  account = "AccountTab",
}

export enum Screens {
  store = "Store",
  cart = "My cart",
  signIn = "Sign in",
  signUp = "Sign up",
  loggedHome = "My account",
  pay = "Pay",
  account = "Account",
  password = "Change my password",
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
//#endregion COMMON NAVIGATION OPTIONS

//#region STACKS
const HomeStack = createStackNavigator();
export function HomeStackScreen({ navigation }) {
  const { state } = useStore();

  return (
    <HomeStack.Navigator screenOptions={commonNavScreenOptions}>
      <HomeStack.Screen name={Screens.store} component={MainScreen} />
    </HomeStack.Navigator>
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
        options={{ headerTitle: "Cart" }}
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
            component={LoggedScreen}
          />
          <AccountStack.Screen
            name={Screens.password}
            component={PasswordScreen}
          />
        </>
      )}
    </AccountStack.Navigator>
  );
}
//#endregion STACKS
