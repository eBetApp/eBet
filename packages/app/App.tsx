// Check .env file
import "./credentials";
// React imports
import React from "react";
// Redux imports
import { StoreProvider } from "./src/Redux/store";
// Navigation imports
import Navigator from "./src/Navigator/BottomNavigator";
// UI imports
import { ThemeProvider } from "react-native-elements";
import theme from "./src/Resources/Theme";

export default function App() {
  return (
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <Navigator />
      </ThemeProvider>
    </StoreProvider>
  );
}
