import React, { useContext, useRef } from "react";
import { View, ScrollView, Image, RefreshControl } from "react-native";

// UI imports
import { Text } from "react-native-elements";
import { ThemeContext } from "react-native-elements";
// Redux import
import { useStore } from "../../Redux/store";
// fetch api
import { MatchCard, Loader } from "../../components";
// Resources import
import { storeScreenVM } from "../../Hooks";

import { Images, Strings, Navigation } from "../../Resources";

export default function StoreScreen({ navigation }) {

	const { state, dispatch } = useStore();
	const { theme } = useContext(ThemeContext);

	// Fetch
	const { fetchIsProcessing, upcomingMatchs, fetch } = storeScreenVM.useInitFetch(state);


	return (
		<View style={{ flex: 1 }}>
			{state.user != null ? (
				<>
					{fetchIsProcessing && upcomingMatchs?.length === 0 ? (
						<Loader style={{ flex: 1 }} />
					) : (
						<ScrollView
							refreshControl={
								<RefreshControl
									refreshing={fetchIsProcessing && upcomingMatchs?.length !== 0}
									onRefresh={fetch}
								/>
							}
						>
							{upcomingMatchs.map(match => {
								return <MatchCard key={match.id} match={match} canBet={true} />;
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
		</View>
	);
}
