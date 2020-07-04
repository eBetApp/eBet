import React from "react";
import { View } from "react-native";
// UI imports
import { Text } from "react-native-elements";
import { ButtonValid } from "../../components";
// Redux import
import { useStore } from "../../Redux/store";
// Resources imports
import { Navigation, Strings } from "../../Resources";
import { CartScreenProps } from "../../Navigator/StacksNavigator";

export default function CartScreen({ navigation }: CartScreenProps) {
  const { state } = useStore();

  return (
    <>
      {state.user != null ? (
        <View>
          <ButtonValid
            title={Strings.buttons.valid_payment}
            onPress={() =>
              navigation.navigate(Navigation.Screens.pay, { amount: 2000 })
            }
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
