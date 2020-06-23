import axios from 'axios';
import { writeFileSync } from 'fs';

export const fetchPastMatch = () => {
	console.log("fetching api")
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
	console.log("fetching api")
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
	console.log("fetching api")
	axios.get("https://api.pandascore.co/lives", {
		headers: {
			"authorization": `Bearer ${process.env.PANDA_SCORE_API}`
		}
	})
		.then(response => {
			writeFileSync(__dirname + '/../../../datas/lives.json', JSON.stringify(response.data, null, '\t'));
		})
}