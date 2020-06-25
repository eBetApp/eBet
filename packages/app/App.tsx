// React imports
import React from "react";
import { TouchableOpacity } from "react-native";

// Redux imports
import { StoreProvider } from "./src/hooks/store";
import { useStore } from "./src/hooks/store";

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
import { Icon, ThemeProvider, Theme } from "react-native-elements";
import Palette from "./src/Res/Palette";

//#region COMMON NAV OPTIONS & STYLES
interface CustomTheme extends Theme {
  customColors?: {
    readonly primaryBg?: string;
    readonly secondaryBg?: string;
    readonly ternaryBgValid?: string;
    readonly ternaryBgCancel?: string;
    readonly ternaryBg3?: string;
    readonly ternaryBg4?: string;
  };
}

const theme: CustomTheme = {
  customColors: {
    primaryBg: Palette.primaryBg,
    secondaryBg: Palette.secondaryBg,
    ternaryBgValid: Palette.ternaryBgValid,
    ternaryBgCancel: Palette.ternaryBgCancel,
    ternaryBg3: Palette.ternaryBg3,
  },
  colors: {
    primary: Palette.primaryText,
    secondary: Palette.secondaryText,
  },
  Text: {
    style: {
      color: Palette.primaryText,
    },
  },
};

const commonNavScreenOptions = {
  headerStyle: {
    backgroundColor: theme.customColors.secondaryBg,
  },
  headerTintColor: theme.colors.primary,
  cardStyle: { backgroundColor: theme.customColors.primaryBg },
};

const commonStackScreenOptions = ({ navigation }) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate("Account")}>
        <Icon
          name="ios-person"
          type="ionicon"
          color={theme.colors.primary}
          style={{ marginRight: 5 }}
        />
      </TouchableOpacity>
    ),
  };
};

const tabBarOptions = {
  activeTintColor: theme.colors.primary,
  inactiveTintColor: theme.colors.secondary,
  style: {
    backgroundColor: theme.customColors.secondaryBg,
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
        options={(navigation) => commonStackScreenOptions(navigation)}
      />
      <ShopStack.Screen name="Pay" component={PayScreen} />
    </ShopStack.Navigator>
  );
}

const AccountStack = createStackNavigator();
function AccountStackScreen() {
  const { state } = useStore();

  return (
    <AccountStack.Navigator screenOptions={commonNavScreenOptions}>
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
          <Tab.Navigator tabBarOptions={tabBarOptions}>
            <Tab.Screen name="Home" component={HomeStackScreen} />
            <Tab.Screen name="Panier" component={ShopStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </ThemeProvider>
  );
}
