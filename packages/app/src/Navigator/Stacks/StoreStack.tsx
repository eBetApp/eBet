// React imports
import React from "react";
// Navigation imports
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
// Resources imports
import * as Navigation from "../../Resources/Navigation";
// Screens imports
import { StoreScreen, PayScreen } from "../../screens/storeTab";
// Redux imports
import { useStore } from "../../Redux/store";
import { commonNavScreenOptions, headerOptionsWithBadge } from ".";

//#region TYPES
type StoreStackParamList = {
  [Navigation.Screens.store]: undefined;
  [Navigation.Screens.pay]: { amount: number, setPaymentDone: (value: boolean) => void };
};

// Store screen
type StoreScreenNavigationProp = StackNavigationProp<
  StoreStackParamList,
  Navigation.Screens.store
>;
type StoreScreenRouteProp = RouteProp<
  StoreStackParamList,
  Navigation.Screens.store
>;
export type StoreScreenProps = {
  navigation: StoreScreenNavigationProp;
  route: StoreScreenRouteProp;
};

// Pay screen
type PayScreenNavigationProp = StackNavigationProp<
  StoreStackParamList,
  Navigation.Screens.pay
>;

type PayScreenRouteProp = RouteProp<StoreStackParamList, Navigation.Screens.pay>;

export type PayScreenProps = {
  navigation: PayScreenNavigationProp;
  route: PayScreenRouteProp;
};

//#endregion TYPES

const StoreStack = createStackNavigator<StoreStackParamList>();
export function StoreStackScreen({ navigation }) {
  const { state } = useStore();

  return (
    <StoreStack.Navigator screenOptions={commonNavScreenOptions}>
      <StoreStack.Screen
        name={Navigation.Screens.store}
        options={() => headerOptionsWithBadge(state)}
        component={StoreScreen}
      />
      <StoreStack.Screen
        name={Navigation.Screens.pay}
        options={() => headerOptionsWithBadge(state)}
        component={PayScreen}
      />
    </StoreStack.Navigator>
  );
}
