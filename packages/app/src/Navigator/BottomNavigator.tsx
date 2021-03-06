// React imports
import React, { useContext } from "react";

// Redux imports
import { useStore } from "../Redux/store";
// Navigation imports
import { createBottomTabNavigator, BottomTabBarOptions } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StoreStackScreen, MyBetsStackScreen, AccountStackScreen } from "./Stacks";
// UI imports
import { ThemeContext, Badge } from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { CustomTheme } from "../Resources/Theme";
// Resources imports
import { Tabs } from "../Resources/Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
		<SafeAreaProvider>
			<NavigationContainer>
				<Tab.Navigator
					tabBarOptions={tabBarOptions}
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;
							if (route.name === Tabs.store) {
								iconName = "gamepad";
							} else if (route.name === Tabs.myBets) {
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
						name={Tabs.myBets}
						options={{ title: "My bets" }}
						component={MyBetsStackScreen}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
