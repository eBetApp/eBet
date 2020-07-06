import React, { MutableRefObject, useContext } from "react";
import { View, StyleSheet, Modal, Text } from "react-native";
import Palette from "../Resources/Palette";

interface IProps {
	match: Match;
	betTeams: number;
	visible: boolean;
}

export function AmountPopup(props: IProps) {
	const { match, betTeams, visible } = props;

	return (
		<Modal visible={visible}>
			<View>
				<Text>toto</Text>
			</View>
		</Modal>
	);
}
