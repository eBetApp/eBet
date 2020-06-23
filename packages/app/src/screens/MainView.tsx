import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

// Redux import
import { useStore } from "../hooks/store";

export default function MainView({ navigation }) {
  const { state, dispatch } = useStore();

  return (
    <View>
      <Text>A LA UNE</Text>
    </View>
  );
}
