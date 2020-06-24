// React imports
import React from "react";
import { TouchableOpacity } from "react-native";

// Redux imports
import { StoreProvider } from "./src/hooks/store";

// Navigation imports
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Screens imports
import MainScreen from "./src/screens/MainView";
import ShopScreen from "./src/screens/ShopView";
import PayScreen from "./src/screens/PayView";
import SignInScreen from "./src/screens/SignInView";
import SignUpScreen from "./src/screens/SignUpView";
import LoggedScreen from "./src/screens/LoggedView";

// UI imports
import { Icon } from "react-native-elements";

// Redux import
import { useStore } from "./src/hooks/store";

const HomeStack = createStackNavigator();
function HomeStackScreen({ navigation }) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={MainScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Account")}>
              <Icon name="ios-person" type="ionicon" color="#000000" />
            </TouchableOpacity>
          ),
        }}
      />
      <HomeStack.Screen name="Account" component={AccountStackScreen} />
    </HomeStack.Navigator>
  );
}

const ShopStack = createStackNavigator();
function ShopStackScreen({ navigation }) {
  return (
    <ShopStack.Navigator>
      <ShopStack.Screen
        name="Shopping cart"
        component={ShopScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Account")}>
              <Icon name="ios-person" type="ionicon" color="#000000" />
            </TouchableOpacity>
          ),
        }}
      />
      <ShopStack.Screen name="Pay" component={PayScreen} />
    </ShopStack.Navigator>
  );
}

const AccountStack = createStackNavigator();
function AccountStackScreen() {
  const { state } = useStore();

  return (
    <AccountStack.Navigator>
      {state.user == null ? (
        <>
          <AccountStack.Screen name="signin" component={SignInScreen} />
          <AccountStack.Screen name="signup" component={SignUpScreen} />
        </>
      ) : (
        <AccountStack.Screen name="LoggedHome" component={LoggedScreen} />
      )}
    </AccountStack.Navigator>
  );
}
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <StoreProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeStackScreen} />
          <Tab.Screen name="Panier" component={ShopStackScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
}
