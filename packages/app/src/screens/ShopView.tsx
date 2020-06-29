import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

// UI imports
import { Input, Icon, Text } from "react-native-elements";
import { ButtonValid } from "../components/styled/Buttons";

// Redux import
import { useStore } from "../hooks/store";
import { MainView } from "../components/styled/MainView";
import { ScrollView } from "react-native-gesture-handler";

export default function ShopView({ navigation }) {
  const { state, dispatch } = useStore();

  return (
    <>
      {state.user != null ? (
        <View>
          <ButtonValid title="PAY" onPress={() => navigation.navigate("Pay")} />
        </View>
      ) : (
        <View>
          <Text>!! YOU MUST BE LOGGED !!</Text>
        </View>
      )}
    </>
  );
}
