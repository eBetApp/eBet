import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

// UI imports
import { Button, Input, Icon, Text } from "react-native-elements";

// Redux import
import { useStore } from "../hooks/store";

export default function ShopView({ navigation }) {
  const { state, dispatch } = useStore();

  return (
    <>
      {state.user != null ? (
        <View>
          <Button title="PAY" onPress={() => navigation.navigate("Pay")} />
        </View>
      ) : (
        <View>
          <Text>!! YOU MUST BE LOGGED !!</Text>
        </View>
      )}
    </>
  );
}
