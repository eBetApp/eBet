// Source: https://overreacted.io/fr/making-setinterval-declarative-with-react-hooks/

import { useEffect, useRef } from 'react';

export const useInterval = (callback: any, delay: number) => {
	const savedCallback = useRef<any>();

	// Se souvenir de la dernière fonction de rappel.
	useEffect(() => {
		savedCallback.current = callback;
	});

	// Configurer l’interval
	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
};
