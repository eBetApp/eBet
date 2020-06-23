import axios from 'axios';
import { writeFileSync } from 'fs';
import schedule from 'node-schedule';

export const startSchedule = () => {
	fetchPastMatch();
	fetchlivesMatch();
	fetchUpcomingMatch();

	schedule.scheduleJob('0 2 * * *', fetchPastMatch);
	schedule.scheduleJob('*/5 * * * *', fetchlivesMatch);
	schedule.scheduleJob('0 2 * * *', fetchUpcomingMatch);
}

export const fetchPastMatch = () => {
	axios.get("https://api.pandascore.co/matches/past", {
		headers: {
			"authorization": `Bearer ${process.env.PANDA_SCORE_API}`
		}
	})
		.then(response => {
			writeFileSync(__dirname + '/../../../datas/matches.past.json', JSON.stringify(response.data, null, '\t'));
		})
}

export const fetchUpcomingMatch = () => {
	axios.get("https://api.pandascore.co/matches/upcoming", {
		headers: {
			"authorization": `Bearer ${process.env.PANDA_SCORE_API}`
		}
	})
		.then(response => {
			writeFileSync(__dirname + '/../../../datas/matches.upcoming.json', JSON.stringify(response.data, null, '\t'));
		})
}

export const fetchlivesMatch = () => {
	axios.get("https://api.pandascore.co/lives", {
		headers: {
			"authorization": `Bearer ${process.env.PANDA_SCORE_API}`
		}
	})
		.then(response => {
			writeFileSync(__dirname + '/../../../datas/lives.json', JSON.stringify(response.data, null, '\t'));
		})
}