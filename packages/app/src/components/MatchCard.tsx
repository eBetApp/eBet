import React, { useState, useContext } from "react";
import Toast from "react-native-easy-toast";
// UI imports
import { ThemeContext, Text, Card } from "react-native-elements";
import { View, StyleSheet } from "react-native";
import Palette from "../Resources/Palette";
import { AmountPopup } from ".";

interface IProps {
	match: Match;
	canBet: boolean;
}

export function MatchCard(props: IProps) {
	// Theme
	const { theme } = useContext(ThemeContext);
	const [betTeam, setBetTeam] = useState<number>();
	const { match, canBet } = props;

	const betOnTeam = async (teamId: number = 0) => {
		console.log("match :", match.id, "team :", teamId);
		setBetTeam(teamId);
		// return <AmountPopup match={match} betTeams={teamId} visible={true} />;
	};

	if (!match.opponents[0] || !match.opponents[1]) {
		return <></>;
	}

	return (
		<View>
			<AmountPopup match={match} betTeams={betTeam} visible={false} />
			<Card>
				<Text>Game : {match.videogame.name}</Text>
				<Text>Match : {match.name}</Text>
				<View style={{ flex: 1, flexDirection: "row" }}>
					{canBet ? (
						<>
							<View
								style={styles.equipeCanBet}
								onTouchEnd={() => betOnTeam(match.opponents[0]?.opponent.id)}
							>
								<Text>{match.opponents[0]?.opponent.name}</Text>
								<Text>Odd : {match.opponents[0]?.opponent.odd}</Text>
							</View>
							<View
								style={styles.equipeCanBet}
								onTouchEnd={() => betOnTeam(match.opponents[1]?.opponent.id)}
							>
								<Text>{match.opponents[1]?.opponent.name}</Text>
								<Text>Odd : {match.opponents[1]?.opponent.odd}</Text>
							</View>
						</>
					) : (
						<>
							<View style={styles.equipeCannotBet}>
								<Text>{match.opponents[0]?.opponent.name}</Text>
								<Text>Odd : {match.opponents[0]?.opponent.odd}</Text>
							</View>
							<View style={styles.equipeCannotBet}>
								<Text>{match.opponents[1]?.opponent.name}</Text>
								<Text>Odd : {match.opponents[1]?.opponent.odd}</Text>
							</View>
						</>
					)}
				</View>
			</Card>
		</View>
	);
}

const styles = StyleSheet.create({
	equipeCanBet: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		margin: 10,
		padding: 5,
		borderRadius: 20,
		backgroundColor: Palette.ternaryBgValid,
	},
	equipeCannotBet: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		margin: 10,
		padding: 5,
		borderWidth: 5,
		borderColor: Palette.ternaryBgEdit,
		borderRadius: 20,
		backgroundColor: Palette.primaryBg,
	},
});
