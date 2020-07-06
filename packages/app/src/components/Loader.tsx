import React from 'react';
import { ActivityIndicator } from 'react-native';
import theme from '../Resources/Theme';

export function Loader(props) {
	return (
		<ActivityIndicator
			{...props}
			hidesWhenStopped={true}
			size="small"
			color={theme.colors.secondary}
		/>
	);
}
