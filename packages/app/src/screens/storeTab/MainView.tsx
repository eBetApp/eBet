import React from "react";
import { View } from "react-native";
// UI imports
import { Text } from "react-native-elements";
import { ButtonValid, ButtonCancel } from "../../components";
// Redux import
import { useStore } from "../../Redux/store";

export default function MainView() {
  return (
    <View>
      <Text>TEST DES DIFFERENTS BOUTONS</Text>
      <ButtonValid title="VALID" />
      <ButtonCancel title="CANCEL" />
    </View>
  );
}
