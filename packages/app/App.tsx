import React from "react";
import { StoreProvider } from "./src/hooks/store";
import MainScreen from "./src/screens/MainView";
import PayScreen from "./src/screens/PayView";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function App() {
  return (
    <StoreProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={MainScreen} />
          <Stack.Screen name="Pay" component={PayScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
}
