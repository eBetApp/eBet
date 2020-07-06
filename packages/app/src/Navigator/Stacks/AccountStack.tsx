// React imports
import React from "react";
// Navigation imports
import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { RouteProp } from "@react-navigation/native";
import {
  commonNavScreenOptions,
  headerOptionsWithBadge,
  headerOptionsWithoutBadge,
} from ".";
// Screens imports
import {
  SignInScreen,
  SignUpScreen,
  LoggedScreen,
  PasswordScreen,
  ClaimWinningsScreen,
} from "../../screens/accountTab";
// Resources imports
import * as Navigation from "../../Resources/Navigation";
// Redux imports
import { useStore } from "../../Redux/store";

//#region TYPES
type AccountStackParamList = {
  [Navigation.Screens.signIn]: undefined;
  [Navigation.Screens.signUp]: undefined;
  [Navigation.Screens.loggedHome]: undefined;
  [Navigation.Screens.password]: undefined;
  [Navigation.Screens.claimMoney]: undefined;
};

// SignIn screen
type SignInScreenNavigationProp = StackNavigationProp<
  AccountStackParamList,
  Navigation.Screens.signIn
>;

type SignInScreenRouteProp = RouteProp<
  AccountStackParamList,
  Navigation.Screens.signIn
>;

export type SignInScreenProps = {
  navigation: SignInScreenNavigationProp;
  route: SignInScreenRouteProp;
};

// SignUp screen
type SignUpScreenNavigationProp = StackNavigationProp<
  AccountStackParamList,
  Navigation.Screens.signUp
>;

type SignUpScreenRouteProp = RouteProp<
  AccountStackParamList,
  Navigation.Screens.signUp
>;

export type SignUpScreenProps = {
  navigation: SignUpScreenNavigationProp;
  route: SignUpScreenRouteProp;
};

// Logged screen
type LoggedScreenNavigationProp = StackNavigationProp<
  AccountStackParamList,
  Navigation.Screens.loggedHome
>;

type LoggedScreenRouteProp = RouteProp<
  AccountStackParamList,
  Navigation.Screens.loggedHome
>;

export type LoggedScreenProps = {
  navigation: LoggedScreenNavigationProp;
  route: LoggedScreenRouteProp;
};

// Password screen
type PasswordScreenNavigationProp = StackNavigationProp<
  AccountStackParamList,
  Navigation.Screens.password
>;

type PasswordScreenRouteProp = RouteProp<
  AccountStackParamList,
  Navigation.Screens.password
>;

export type PasswordScreenProps = {
  navigation: PasswordScreenNavigationProp;
  route: PasswordScreenRouteProp;
};

// Claim winnings screen
type ClaimScreenNavigationProp = StackNavigationProp<
  AccountStackParamList,
  Navigation.Screens.claimMoney
>;

type ClaimScreenRouteProp = RouteProp<
  AccountStackParamList,
  Navigation.Screens.claimMoney
>;

export type ClaimScreenProps = {
  navigation: ClaimScreenNavigationProp;
  route: ClaimScreenRouteProp;
};

//#endregion TYPES

const AccountStack = createStackNavigator<AccountStackParamList>();
export function AccountStackScreen() {
  const { state } = useStore();

  return (
    <AccountStack.Navigator screenOptions={commonNavScreenOptions}>
      {state.user == null ? (
        <>
          <AccountStack.Screen
            name={Navigation.Screens.signIn}
            options={() => headerOptionsWithoutBadge(state)}
            component={SignInScreen}
          />
          <AccountStack.Screen
            name={Navigation.Screens.signUp}
            options={() => headerOptionsWithoutBadge(state)}
            component={SignUpScreen}
          />
        </>
      ) : (
        <>
          <AccountStack.Screen
            name={Navigation.Screens.loggedHome}
            options={() => headerOptionsWithBadge(state)}
            component={LoggedScreen}
          />
          <AccountStack.Screen
            name={Navigation.Screens.password}
            options={() => headerOptionsWithBadge(state)}
            component={PasswordScreen}
          />
          <AccountStack.Screen
            name={Navigation.Screens.claimMoney}
            component={ClaimWinningsScreen}
          />
        </>
      )}
    </AccountStack.Navigator>
  );
}
