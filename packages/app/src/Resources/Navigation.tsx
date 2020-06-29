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
import { Icon } from "react-native-elements";
import { StackHeaderOptions } from "@react-navigation/stack/lib/typescript/src/types";
import { IState } from "../hooks/ReducerTypes";
import theme from "./Theme";

// Redux imports
import { useStore } from "../hooks/store";

//#region NAVIGATION CONSTANTS
export enum Tabs {
  home = "HomeTab",
  cart = "CartTab",
}

export enum Screens {
  home = "Home",
  cart = "Cart",
  signIn = "SignIn",
  signUp = "SignUp",
  loggedHome = "LoggedHome",
  pay = "Pay",
  account = "Account",
  password = "Password",
}
//#endregion NAVIGATION CONSTANTS

//#region COMMON NAVIGATION OPTIONS
const commonNavScreenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: theme.customColors.secondaryBg,
  },
  headerTintColor: theme.colors.primary,
  cardStyle: { backgroundColor: theme.customColors.primaryBg },
};

const commonStackScreenOptions = (
  { navigation },
  state: IState,
  localOptions?: StackHeaderOptions
) => {
  return {
    ...localOptions,
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate(Screens.account)}>
        <Icon
          name={state.user != null ? "user" : "user-times"}
          type="font-awesome"
          color={theme.colors.primary}
          style={{ marginRight: 5 }}
        />
      </TouchableOpacity>
    ),
  };
};
//#endregion COMMON NAVIGATION OPTIONS

//#region STACKS
const HomeStack = createStackNavigator();
export function HomeStackScreen({ navigation }) {
  const { state } = useStore();

  return (
    <HomeStack.Navigator screenOptions={commonNavScreenOptions}>
      <HomeStack.Screen
        name={Screens.home}
        component={MainScreen}
        options={(navigation) => commonStackScreenOptions(navigation, state)}
      />
      <HomeStack.Screen name={Screens.account} component={AccountStackScreen} />
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
        options={(navigation) =>
          commonStackScreenOptions(navigation, state, { headerTitle: "Cart" })
        }
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
