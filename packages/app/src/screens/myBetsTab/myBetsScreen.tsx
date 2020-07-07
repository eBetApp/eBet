import React, { useContext } from "react";
import { View, ScrollView, Image, RefreshControl } from "react-native";
// UI imports
import { ThemeContext } from "react-native-elements";
import { Text } from "react-native-elements";
// Redux import
import { useStore } from "../../Redux/store";
// fetch api
import { Loader } from "../../components";
// Resources imports
import { myBetsScreenVM } from "../../Hooks";
import { Strings, Images } from "../../Resources";
import { MyBetsScreenProps } from "../../Navigator/Stacks";

import { BetCard } from "../../components/BetCard";

export default function myBetsScreen({ navigation }: MyBetsScreenProps) {
	const { state } = useStore();
	const { theme } = useContext(ThemeContext);

	// Fetch
	const { fetchIsProcessing, myBets, fetchBets } = myBetsScreenVM.useInitFetch(state);

	return (
		<>
			{state.user != null ? (
				<>
					{fetchIsProcessing && myBets?.length === 0 ? (
						<Loader style={{ flex: 1 }} />
					) : (
						<ScrollView
							refreshControl={
								<RefreshControl
									refreshing={fetchIsProcessing && myBets?.length !== 0}
									onRefresh={fetchBets}
								/>
							}
						>
							{myBets.map(bet => {
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
