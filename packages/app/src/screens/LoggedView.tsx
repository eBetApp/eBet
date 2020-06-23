import React from "react";
import { Text, View } from "react-native";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchVoidUser } from "../hooks/dispatchers";

// UI imports
import { Button } from "react-native-elements";

export default function LoggedView({ navigation }) {
  const { dispatch } = useStore();

  return (
    <View>
      <Text>LOGGED</Text>
      <Button title="LOG OUT" onPress={() => dispatchVoidUser(dispatch)} />
    </View>
  );
}
