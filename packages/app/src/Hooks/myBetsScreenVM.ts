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
	const [myBets, setMyBets] = useState<Bet[]>([]);

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
		const payload = {
			uuidUser: state.user.uuid
		}
		const test = await betService.getMyBets(token, payload)
		return await betService.getMyBets(token, payload);
	};

	const handleFetchRes = (res, setError) => {
		console.log("Error fetching myBets data: ", res.data.length);
		setMyBets(res.data);
	};

	return { initLoading: fetchIsProcessing, myBets };
};
