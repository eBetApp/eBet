import React, { useContext } from "react";
import { View, ScrollView, Image } from "react-native";
// UI imports
import { ThemeContext } from "react-native-elements";
import { Text } from "react-native-elements";
// Redux import
import { useStore } from "../../Redux/store";
// fetch api
import { MatchCard, Loader } from "../../components";
// Resources imports
import { myBetsScreenVM } from "../../Hooks";
import { Navigation, Strings, Images } from "../../Resources";
import { MyBetsScreenProps } from "../../Navigator/Stacks";

import { BetCard } from "../../components/BetCard"

export default function myBetsScreen({ navigation }: MyBetsScreenProps) {
	const { state } = useStore();
	const { theme } = useContext(ThemeContext);

	// Fetch
	const { initLoading, myBets } = myBetsScreenVM.useInitFetch(state);

	// console.log(initLoading, myBets);

	return (
		<>
			{state.user != null ? (
				<>
				{initLoading ? (
					<Loader style={{ flex: 1 }} />
				) : (
					<ScrollView>
						{myBets.map(bet => {
							// return <Text> oooooooooooo </Text>;
							return <BetCard key={bet.uuid} bet={bet} />;
						})}
						<Text>{"\n"}</Text>
					</ScrollView>
				)}
			</>
			) : (
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Image source={Images.noShopping} style={{ width: 50, height: 50 }} />
					<Text style={{ color: theme.colors.error }}>{Strings.text.must_be_logged}</Text>
				</View>
			)}
		</>
	);
}
