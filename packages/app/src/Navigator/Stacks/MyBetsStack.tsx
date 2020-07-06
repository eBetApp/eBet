// React imports
import React from "react";
// Navigation imports
import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { RouteProp } from "@react-navigation/native";
import { commonNavScreenOptions, headerOptionsWithBadge } from ".";
// Resources imports
import * as Navigation from "../../Resources/Navigation";
// Screens imports
import { myBetsScreen } from "../../screens/myBetsTab";
// Redux imports
import { useStore } from "../../Redux/store";

//#region TYPES
type MyBetsStackParamList = {
  [Navigation.Screens.myBets]: undefined;
};


// Cart screen
type MyBetsScreenNavigationProp = StackNavigationProp<
  MyBetsStackParamList,
  Navigation.Screens.myBets
>;

type MyBetsScreenRouteProp = RouteProp<
 MyBetsStackParamList,
  Navigation.Screens.myBets
>;

export type MyBetsScreenProps = {
  navigation: MyBetsScreenNavigationProp;
  route: MyBetsScreenRouteProp;
};
//#endregion TYPES

const MyBetsStack = createStackNavigator<MyBetsStackParamList>();

export function MyBetsStackScreen() {
  const { state } = useStore();

  return (
    <MyBetsStack.Navigator screenOptions={commonNavScreenOptions}>
      <MyBetsStack.Screen
        name={Navigation.Screens.myBets}
        component={myBetsScreen}
        options={() => headerOptionsWithBadge(state)}
      />
    </MyBetsStack.Navigator>
  );
}
