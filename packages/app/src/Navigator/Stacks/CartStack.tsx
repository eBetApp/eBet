// React imports
import React from "react";
// Navigation imports
import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { RouteProp } from "@react-navigation/native";
import { commonNavScreenOptions, headerOptions } from ".";
// Resources imports
import * as Navigation from "../../Resources/Navigation";
// Screens imports
import { CartScreen, PayScreen } from "../../screens/cartTab";
// Redux imports
import { useStore } from "../../Redux/store";

//#region TYPES
type CartStackParamList = {
  [Navigation.Screens.cart]: undefined;
  [Navigation.Screens.pay]: { amount: number };
};

// Pay screen
type PayScreenNavigationProp = StackNavigationProp<
  CartStackParamList,
  Navigation.Screens.pay
>;

type PayScreenRouteProp = RouteProp<CartStackParamList, Navigation.Screens.pay>;

export type PayScreenProps = {
  navigation: PayScreenNavigationProp;
  route: PayScreenRouteProp;
};

// Cart screen
type CartScreenNavigationProp = StackNavigationProp<
  CartStackParamList,
  Navigation.Screens.cart
>;

type CartScreenRouteProp = RouteProp<
  CartStackParamList,
  Navigation.Screens.cart
>;

export type CartScreenProps = {
  navigation: CartScreenNavigationProp;
  route: CartScreenRouteProp;
};
//#endregion TYPES

const CartStack = createStackNavigator<CartStackParamList>();
export function CartStackScreen({ navigation }) {
  const { state } = useStore();

  return (
    <CartStack.Navigator screenOptions={commonNavScreenOptions}>
      <CartStack.Screen
        name={Navigation.Screens.cart}
        component={CartScreen}
        options={() => headerOptions(state)}
      />
      <CartStack.Screen name={Navigation.Screens.pay} component={PayScreen} />
    </CartStack.Navigator>
  );
}
