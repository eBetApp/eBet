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
import { Icon, ThemeProvider } from "react-native-elements";

// Redux import
import { useStore } from "./src/hooks/store";

//#region COMMON NAV OPTIONS & STYLES
const commonNavScreenOptions = {
  headerStyle: {
    backgroundColor: "#F26419",
  },
  cardStyle: { backgroundColor: "#39454D" },
};

const commonStackScreenOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate("Account")}>
        <Icon name="ios-person" type="ionicon" color="#000000" />
      </TouchableOpacity>
    ),
  };
};

const theme = {
  colors: {
    primary: "#F26419",
  },
  "TypedNavigator.Navigator": {
    screenOptions: {
      headerStyle: {
        backgroundColor: "#F26419",
      },
      cardStyle: { backgroundColor: "#39454D" },
    },
  },

  // View: {
  //   style: {
  //     backgroundColor: "#39454D",
  //   },
  // },
  Button: {
    raised: true,
  },
};
//#endregion COMMON NAV OPTIONS & STYLES

//#region NAV ELEMENTS
const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();
function HomeStackScreen({ navigation }) {
  return (
    <HomeStack.Navigator screenOptions={commonNavScreenOptions}>
      <HomeStack.Screen
        name="Home"
        component={MainScreen}
        options={(navigation) => commonStackScreenOptions(navigation)}
      />
      <HomeStack.Screen name="Account" component={AccountStackScreen} />
    </HomeStack.Navigator>
  );
}

const ShopStack = createStackNavigator();
function ShopStackScreen({ navigation }) {
  return (
    <ShopStack.Navigator screenOptions={commonNavScreenOptions}>
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
//#endregion NAV ELEMENTS

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <StoreProvider>
        <NavigationContainer>
          <Tab.Navigator
            tabBarOptions={{
              activeTintColor: "#F6AE2D",
              inactiveTintColor: "#39454D",
              style: {
                backgroundColor: theme.colors.primary,
              },
            }}
          >
            <Tab.Screen name="Home" component={HomeStackScreen} />
            <Tab.Screen name="Panier" component={ShopStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </ThemeProvider>
  );
}
