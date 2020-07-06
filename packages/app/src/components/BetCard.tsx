import React, { useState, useContext } from "react";
import Toast from "react-native-easy-toast";
// UI imports
import { ThemeContext, Text, Card } from "react-native-elements";
import { View, StyleSheet } from "react-native";
import Palette from "../Resources/Palette";
import { AmountPopup } from ".";

import { useNavigation } from "@react-navigation/native";

interface IProps {
	bet: Bet;
}

export function BetCard(props: IProps) {
	const navigation = useNavigation();
	// Theme
	const { theme } = useContext(ThemeContext);
	const [showModal, setShowModal] = useState<boolean>(false);
	const { bet: bet } = props;

	const nameWinner = (bet.idWinner === bet.idTeam1) ? bet.team1 : bet.team2;
	let asWin = (bet.idTeamBet === bet.idWinner) ? "equipeWon" : "equipeLose";
	asWin = (bet.idTeamBet === null) ? "equipeNone" : asWin;

	return (
		<View>
			<Card>
				<Text>Game : {bet.gameName}</Text>
				<Text>Match : {bet.matchName}</Text>
				<View style={{ flex: 1, flexDirection: "row" }}>
					<View
						style={styles.equipeCanBet}
					>
						<Text>{bet.team1}</Text>
					</View>
					<View
						style={styles.equipeCanBet}
					>
						<Text>{bet.team2}</Text>
					</View>
				</View>
				<Text>Who won ? </Text>
				<View style={styles[asWin]}>
					<Text>{nameWinner}</Text>
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
	equipeWon: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		margin: 10,
		padding: 5,
		borderRadius: 20,
		backgroundColor: "green",
	},
	equipeLose: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		margin: 10,
		padding: 5,
		borderRadius: 20,
		backgroundColor: "red",
	},
	equipeNone: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		margin: 10,
		padding: 5,
		borderRadius: 20,
		backgroundColor: Palette.ternaryBg4,
	},
});
