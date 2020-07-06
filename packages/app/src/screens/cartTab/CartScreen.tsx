import React, { useContext } from "react";
import { View, Image } from "react-native";
// UI imports
import { ThemeContext } from "react-native-elements";
import { Text } from "react-native-elements";
import { ButtonValid } from "../../components";
// Redux import
import { useStore } from "../../Redux/store";
// Resources imports
import { Navigation, Strings, Images } from "../../Resources";
import { CartScreenProps } from "../../Navigator/Stacks";

export default function CartScreen({ navigation }: CartScreenProps) {
	const { state } = useStore();
	const { theme } = useContext(ThemeContext);

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
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Image source={Images.noShopping} style={{ width: 50, height: 50 }} />
					<Text style={{ color: theme.colors.error }}>{Strings.text.must_be_logged}</Text>
				</View>
			)}
		</>
	);
}
