import axios from 'axios';
import { writeFileSync } from 'fs';
import schedule from 'node-schedule';
import ApiDatas from './apiDatas';

const apiDatas = new ApiDatas()

export const startSchedule = () => {
	fetchPastMatch();
	fetchlivesMatch();
	fetchUpcomingMatch();

	schedule.scheduleJob('0 2 * * *', fetchPastMatch);		// tout les jour a 2H
	schedule.scheduleJob('*/5 * * * *', fetchlivesMatch);	// toute les 5 minutes
	schedule.scheduleJob('0 2 * * *', fetchUpcomingMatch);	// tout les jour a 2H
}

export const fetchPastMatch = () => {
	axios.get("https://api.pandascore.co/matches/past", {
		headers: {
			"authorization": `Bearer ${process.env.PANDA_SCORE_API}`
		}
	})
		.then(response => {
			new ApiDatas().chargePastMatch(response.data);
		})
}

export const fetchUpcomingMatch = () => {
	axios.get("https://api.pandascore.co/matches/upcoming", {
		headers: {
			"authorization": `Bearer ${process.env.PANDA_SCORE_API}`
		}
	})
		.then(response => {
			new ApiDatas().chargeUpcomingMatch(response.data);
		})
}

export const fetchlivesMatch = () => {
	axios.get("https://api.pandascore.co/lives", {
		headers: {
			"authorization": `Bearer ${process.env.PANDA_SCORE_API}`
		}
	})
		.then(response => {
			new ApiDatas().chargeLiveMatch(response.data);
		})
}