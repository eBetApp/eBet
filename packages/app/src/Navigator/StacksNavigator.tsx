// React imports
import React from "react";
// Navigation imports
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import * as Navigation from "../Resources/Navigation";
// Screens imports
import MainScreen from "../screens/storeTab/MainView";
import CartScreen from "../screens/cartTab/CartView";
import PayScreen from "../screens/cartTab/PayView";
import SignInScreen from "../screens/accountTab/SignInView";
import SignUpScreen from "../screens/accountTab/SignUpView";
import LoggedScreen from "../screens/accountTab/LoggedView";
import PasswordScreen from "../screens/accountTab/PasswordView";
import RetrieveMoneyScreen from "../screens/accountTab/ClaimWinningsView";
// UI imports
import theme, { CustomTheme } from "../Resources/Theme";
// Redux imports
import { useStore } from "../Redux/store";
import { Badge } from "react-native-elements";
import { IState } from "../Redux/ReducerTypes";
import { StackHeaderOptions } from "@react-navigation/stack/lib/typescript/src/types";

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
        name={Navigation.Screens.store}
        options={() => headerRightOption(state)}
        component={MainScreen}
      />
    </StoreStack.Navigator>
  );
}

const CartStack = createStackNavigator();
export function CartStackScreen({ navigation }) {
  const { state } = useStore();

  return (
    <CartStack.Navigator screenOptions={commonNavScreenOptions}>
      <CartStack.Screen
        name={Navigation.Screens.cart}
        component={CartScreen}
        options={() => headerRightOption(state)}
      />
      <CartStack.Screen name={Navigation.Screens.pay} component={PayScreen} />
    </CartStack.Navigator>
  );
}

const AccountStack = createStackNavigator();
export function AccountStackScreen() {
  const { state } = useStore();

  return (
    <AccountStack.Navigator screenOptions={commonNavScreenOptions}>
      {state.user == null ? (
        <>
          <AccountStack.Screen
            name={Navigation.Screens.signIn}
            component={SignInScreen}
          />
          <AccountStack.Screen
            name={Navigation.Screens.signUp}
            component={SignUpScreen}
          />
        </>
      ) : (
        <>
          <AccountStack.Screen
            name={Navigation.Screens.loggedHome}
            options={() => headerRightOption(state)}
            component={LoggedScreen}
          />
          <AccountStack.Screen
            name={Navigation.Screens.password}
            options={() => headerRightOption(state)}
            component={PasswordScreen}
          />
          <AccountStack.Screen
            name={Navigation.Screens.claimMoney}
            component={RetrieveMoneyScreen}
          />
        </>
      )}
    </AccountStack.Navigator>
  );
}
//#endregion STACKS
