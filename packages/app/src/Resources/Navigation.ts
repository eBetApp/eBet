import { createStackNavigator } from "@react-navigation/stack";

export enum Tabs {
  store = "StoreTab",
  myBets = "myBetsTab",
  account = "AccountTab",
}

export enum Screens {
  store = "Store",
  signIn = "Sign in",
  signUp = "Sign up",
  loggedHome = "My account",
  pay = "Pay",
  account = "Account",
  password = "Change my password",
  claimMoney = "Claim my winnings",
  myBets = "My bets"
}
