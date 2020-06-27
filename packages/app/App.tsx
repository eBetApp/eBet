// React imports
import React from "react";

// Redux imports
import { StoreProvider } from "./src/hooks/store";

// Navigation imports
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  HomeStackScreen,
  ShopStackScreen,
  Tabs,
} from "./src/Resources/Navigation";

// UI imports
import { ThemeProvider } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import theme from "./src/Resources/Theme";

// Resources imports

const tabBarOptions = {
  activeTintColor: theme.colors.primary,
  inactiveTintColor: theme.colors.secondary,
  style: {
    backgroundColor: theme.customColors.secondaryBg,
  },
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator
            tabBarOptions={tabBarOptions}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === Tabs.home) {
                  iconName = "ios-home";
                } else if (route.name === Tabs.cart) {
                  iconName = "ios-basket";
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen
              name={Tabs.home}
              options={{ title: "Home" }}
              component={HomeStackScreen}
            />
            <Tab.Screen
              name={Tabs.cart}
              options={{ title: "Cart" }}
              component={ShopStackScreen}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </StoreProvider>
  );
}
