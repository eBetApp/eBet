import React from "react";
import { View } from "react-native";
// UI imports
import { Text } from "react-native-elements";
import { ButtonValid } from "../../components/styled/Buttons";
// Redux import
import { useStore } from "../../hooks/store";
// Resources imports
import * as Navigation from "../../Resources/Navigation";
import * as Strings from "../../Resources/Strings";

export default function CartScreen({ navigation }) {
  const { state, dispatch } = useStore();

  return (
    <>
      {state.user != null ? (
        <View>
          <ButtonValid
            title={Strings.buttons.valid_payment}
            onPress={() => navigation.navigate(Navigation.Screens.pay)}
          />
        </View>
      ) : (
        <View>
          <Text>!! YOU MUST BE LOGGED !!</Text>
        </View>
      )}
    </>
  );
}
