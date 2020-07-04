import React from "react";
import { View } from "react-native";
// UI imports
import { Text } from "react-native-elements";
import { ButtonValid, ButtonCancel } from "../../components";
// Resources imports
import { StoreScreenProps } from "../../Navigator/Stacks";

export default function MainScreen({ navigation }: StoreScreenProps) {
  return (
    <View>
      <Text>TEST DES DIFFERENTS BOUTONS</Text>
      <ButtonValid title="VALID" />
      <ButtonCancel title="CANCEL" />
    </View>
  );
}
