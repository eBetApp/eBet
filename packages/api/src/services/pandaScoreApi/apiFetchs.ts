import axios from 'axios';
import { writeFileSync } from 'fs';
import schedule from 'node-schedule';
import ApiDatas from './apiDatas';

export const startSchedule = () => {
	fetchPastMatch();
	fetchlivesMatch();
	fetchUpcomingMatch();

	schedule.scheduleJob('0 2 * * *', fetchPastMatch);		// tout les jour a 2H
	schedule.scheduleJob('*/5 * * * *', fetchlivesMatch);	// toute les 5 minutes
	schedule.scheduleJob('0 2 * * *', fetchUpcomingMatch);	// tout les jour a 2H
}

export const fetchPastMatch = async () => {
	const fetch = await axios.get("https://api.pandascore.co/matches/past", {
		headers: {
			"authorization": `Bearer ${process.env.PANDA_SCORE_API}`
		}
	})
	new ApiDatas().chargePastMatch(fetch.data);
}

export const fetchUpcomingMatch = async () => {
	const fetch = await axios.get("https://api.pandascore.co/matches/upcoming", {
		headers: {
			"authorization": `Bearer ${process.env.PANDA_SCORE_API}`
		}
	})
	new ApiDatas().chargeUpcomingMatch(fetch.data);
}

export const fetchlivesMatch = async () => {
	const fetch = await axios.get("https://api.pandascore.co/lives", {
		headers: {
			"authorization": `Bearer ${process.env.PANDA_SCORE_API}`
		}
	})
	new ApiDatas().chargeLiveMatch(fetch.data);
}