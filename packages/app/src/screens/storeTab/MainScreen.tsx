import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
// UI imports
import { Text } from "react-native-elements";
// Redux import
import { useStore } from "../../Redux/store";
// fetch api
import betService from "../../Services/betService";
import { MatchCard } from "../../components";
// Resources import
import { readStorageKey } from "../../Resources";

export default function MainView({ navigation }) {
	const { state, dispatch } = useStore();
	const [upcomingMatchs, setUpcomingMatchs] = useState<Match[]>([]);
	const [token, setToken] = useState<string>();

	readStorageKey("token").then(storageToken => setToken(storageToken));

	useEffect(() => {
		betService.getUpcomingMatchs(token).then(fetchedMatchs => {
			console.log("data", fetchedMatchs.data.length);
			setUpcomingMatchs(fetchedMatchs.data);
		});
	}, [token]);

	return (
		<View style={{ flex: 1 }}>
			{state.user != null ? (
				<ScrollView>
					{upcomingMatchs.map(match => {
						return <MatchCard key={match.id} match={match} canBet={true} />;
					})}
					<Text>{"\n"}</Text>
				</ScrollView>
			) : (
				<Text>!! YOU MUST BE LOGGED !!</Text>
			)}
		</View>
	);
}
