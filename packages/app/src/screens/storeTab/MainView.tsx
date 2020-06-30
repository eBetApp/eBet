import React from "react";
import { View } from "react-native";

// UI imports
import { Text } from "react-native-elements";
import { ButtonValid, ButtonCancel } from "../../components/styled/Buttons";

// Redux import
import { useStore } from "../../hooks/store";

export default function MainView({ navigation }) {
  const { state, dispatch } = useStore();

  return (
    <View>
      <Text>TEST DES DIFFERENTS BOUTONS</Text>
      <ButtonValid title="VALID" />
      <ButtonCancel title="CANCEL" />
    </View>
  );
}
