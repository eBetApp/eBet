// React imports
import { useEffect, useState } from "react";
// Hooks imports
import { useFetch } from ".";
// Resources imports
import { readStorageKey, localStorageItems } from "../Resources";
import { IState } from "../Redux/ReducerTypes";
// Utils imports
import { betService } from "../Services";

/** Invoked by useEffect on viewDidLoad */
export const useInitFetch = (state: IState) => {
	const [upcomingMatchs, setUpcomingMatchs] = useState<Match[]>([]);

	useEffect(() => {
		if (state.user !== null && state.user !== undefined) fetch();
	}, [state.user?.uuid]);

	const { fetch, fetchIsProcessing } = useFetch(
		null,
		setErr => true,
		async setErr => fetchRequest(setErr),
		(res, err) => handleFetchRes(res, err),
		err => {}, // tslint:disable-line
	);

	const fetchRequest = async setErr => {
		const token = await readStorageKey(localStorageItems.token);

		return betService.getUpcomingMatchs(token);
	};

	const handleFetchRes = (res, setError) => {
		console.log("Error fetching store data: ", res.data.length);
		setUpcomingMatchs(res.data);
	};

	return { initLoading: fetchIsProcessing, upcomingMatchs };
};
