import React from "react";
import { StoreProvider } from "./src/hooks/store";
import MainView from "./src/screens/MainView";

export default function App() {
  return (
    <StoreProvider>
      <MainView />
    </StoreProvider>
  );
}
