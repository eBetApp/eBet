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
import { MainScreen } from "../../screens/storeTab";
// Redux imports
import { useStore } from "../../Redux/store";
import { commonNavScreenOptions, headerRightOption } from ".";

//#region TYPES
type StoreStackParamList = {
  [Navigation.Screens.store]: undefined;
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

//#endregion TYPES

const StoreStack = createStackNavigator<StoreStackParamList>();
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
