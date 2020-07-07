import React, { MutableRefObject, useContext, useState, useEffect } from "react";
import { View, StyleSheet, Modal, Text, Alert, TouchableHighlight } from "react-native";
import Palette from "../Resources/Palette";
import { Input, Button, Icon } from "react-native-elements";
import { ButtonValid } from ".";
import betService from "../Services/betService";
import { Navigation } from "../Resources";
import { readStorageKey, localStorageItems } from "../Resources";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "../Redux/store";
import { dispatchBetsCount } from "../Redux/dispatchers";

interface IProps {
	match: Match;
	betTeams: number;
	visible: boolean;
	closeFunction: any;
}

export function AmountPopup(props: IProps) {
	const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "."];
	const [amount, setAmount] = useState<string>();
	const { match, betTeams, visible, closeFunction } = props;
	const navigation = useNavigation();
	const [paymentDone, setPaymentDone] = useState<boolean>(false);

	useEffect(() => {
		if (paymentDone) {
			sendBet();
		}
	}, [paymentDone]);

	// Redux
	const { dispatch, state } = useStore();

	const choosenOne =
		betTeams === match.opponents[0].opponent.id
			? match.opponents[0].opponent.name
			: match.opponents[1].opponent.name;

	// console.log("popup opent, visibility: ", visible, " match: ", match.id);

	const handleAmount = (value: string) => {
		console.log(value);

		let nextValue = "";
		let numberOfDot = 0;

		for (const char of value) {
			// remove unwanted char
			if (numbers.indexOf(char) !== -1) {
				if (char === "," || char === ".") {
					numberOfDot++;

					// allow only 1 dot
					if (numberOfDot <= 1) nextValue += ".";
				} else {
					nextValue += char;
				}
			}
		}

		setAmount(nextValue);
	};

	const openPayment = () => {
		closeFunction();
		navigation.navigate(Navigation.Screens.pay, { amount: Number(amount), setPaymentDone });
	};

	const sendBet = async () => {
		// call post
		const token = await readStorageKey(localStorageItems.token);
		const payload = {
			idMatch: match.id,
			amount: Number(amount),
			idTeamBet: betTeams,
			uuidUser: state.user.uuid,
		};
		await betService.postMatch(token, payload);
		dispatchBetsCount(dispatch);
	};

	useEffect(() => {
		if (amount === undefined) {
			return;
		}
		console.log(amount);
		// const lastDigit = amount.toString().split("").pop()
		// if (numbers.indexOf(lastDigit) === -1) {
		// 	console.log("nooo")
		// }
	}, [amount]);

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={() => {
				closeFunction();
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<TouchableHighlight
						style={styles.crossButton}
						onPress={() => {
							closeFunction();
						}}
					>
						<Text style={styles.textStyle}> X </Text>
					</TouchableHighlight>
					<Text style={styles.textStyle}>You choose to bet on</Text>
					<Text style={styles.textTeam}>{choosenOne}</Text>
					<Input
						containerStyle={styles.inputAmount}
						label="Amount"
						labelStyle={styles.textStyle}
						keyboardType={"numeric"}
						textContentType={"none"}
						// secureTextEntry={true}
						// onSubmitEditing={() => newPwdInputErrRef.current.focus()}
						value={amount}
						onChangeText={text => handleAmount(text)}
						blurOnSubmit={false}
						rightIcon={<Icon name="euro-symbol" />}
					/>
					<ButtonValid title={"Send Bet"} onPress={openPayment} />
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: Palette.ternaryBg4,
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	crossButton: {
		backgroundColor: "#f01515",
		position: "absolute",
		top: 8,
		right: 8,
		borderRadius: 50,
		padding: 8,
		elevation: 2,
	},
	textStyle: {
		fontSize: 18,
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	textTeam: {
		color: Palette.secondaryText,
		fontWeight: "bold",
		textAlign: "center",
	},
	inputAmount: {
		color: Palette.primaryText,
		paddingTop: 16,
		minWidth: 200,
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});
