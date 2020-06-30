// React imports
import React, { useContext } from "react";

// Redux imports
import { StoreProvider, useStore } from "./hooks/store";

// Navigation imports
import {
  createBottomTabNavigator,
  BottomTabBarOptions,
} from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  StoreStackScreen,
  ShopStackScreen,
  AccountStackScreen,
  Tabs,
} from "./Resources/NavigationStacks";

// UI imports
import { ThemeProvider, ThemeContext } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { CustomTheme } from "./Resources/Theme";

export default function NestedApp() {
  // Redux
  const { state } = useStore();

  // UI
  const { theme } = useContext(ThemeContext);
  const tabBarOptions: BottomTabBarOptions = {
    activeTintColor: theme.colors.primary,
    inactiveTintColor: (theme as CustomTheme).customColors.primaryBg,
    keyboardHidesTabBar: true,
    style: {
      backgroundColor: (theme as CustomTheme).customColors.secondaryBg,
    },
  };

  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={tabBarOptions}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === Tabs.store) {
              iconName = "gamepad";
            } else if (route.name === Tabs.cart) {
              iconName = "shopping-cart";
            } else if (route.name === Tabs.account) {
              iconName = state.user != null ? "user" : "user-times";
            }
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name={Tabs.account}
          options={{ title: "Account" }}
          component={AccountStackScreen}
        />
        <Tab.Screen
          name={Tabs.store}
          options={{ title: "Store" }}
          component={StoreStackScreen}
        />
        <Tab.Screen
          name={Tabs.cart}
          options={{ title: "Cart" }}
          component={ShopStackScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
