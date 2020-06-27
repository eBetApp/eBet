// React imports
import React from "react";
import { TouchableOpacity, TextInputBase } from "react-native";

// Redux imports
import { StoreProvider } from "./src/hooks/store";
import { useStore } from "./src/hooks/store";

// Navigation imports
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  StackNavigationOptions,
  HeaderTitle,
} from "@react-navigation/stack";
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
import Palette from "./src/Resources/Palette";
import Ionicons from "react-native-vector-icons/Ionicons";
import { State } from "react-native-gesture-handler";
import { StackHeaderOptions } from "@react-navigation/stack/lib/typescript/src/types";
import { IState } from "./src/hooks/ReducerTypes";

// Resources imports
import { Tabs, Screens } from "./src/Resources/Navigation";

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
  Input: {
    placeholderTextColor: Palette.primaryText,
    keyboardAppearance: "dark",
    inputStyle: {
      color: Palette.primaryText,
    },
  },
};

const commonNavScreenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: theme.customColors.secondaryBg,
  },
  headerTintColor: theme.colors.primary,
  cardStyle: { backgroundColor: theme.customColors.primaryBg },
};

const commonStackScreenOptions = (
  { navigation },
  state: IState,
  localOptions?: StackHeaderOptions
) => {
  return {
    ...localOptions,
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate(Screens.account)}>
        <Icon
          name={state.user != null ? "user" : "user-times"}
          type="font-awesome"
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
  const { state } = useStore();

  return (
    <HomeStack.Navigator screenOptions={commonNavScreenOptions}>
      <HomeStack.Screen
        name={Screens.home}
        component={MainScreen}
        options={(navigation) => commonStackScreenOptions(navigation, state)}
      />
      <HomeStack.Screen name={Screens.account} component={AccountStackScreen} />
    </HomeStack.Navigator>
  );
}

const ShopStack = createStackNavigator();
function ShopStackScreen({ navigation }) {
  const { state } = useStore();

  return (
    <ShopStack.Navigator screenOptions={commonNavScreenOptions}>
      <ShopStack.Screen
        name={Screens.cart}
        component={ShopScreen}
        options={(navigation) =>
          commonStackScreenOptions(navigation, state, { headerTitle: "Cart" })
        }
      />
      <ShopStack.Screen name={Screens.pay} component={PayScreen} />
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
          <AccountStack.Screen name={Screens.signIn} component={SignInScreen} />
          <AccountStack.Screen name={Screens.signUp} component={SignUpScreen} />
        </>
      ) : (
        <AccountStack.Screen
          name={Screens.loggedHome}
          component={LoggedScreen}
        />
      )}
    </AccountStack.Navigator>
  );
}
//#endregion NAV ELEMENTS

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
