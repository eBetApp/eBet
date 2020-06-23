import { fetchPastMatch, fetchUpcomingMatch, fetchlivesMatch } from './services/pandaScoreApi/apiFetchs';
import 'reflect-metadata';
require('dotenv').config();
// ORM
import { createConnection } from 'typeorm';
// INTERNALS
import app from './core/app';
// import User from './database/models/User';
import connection from './database/connection';

if (process.env.DB_DEV_URL == null)
	throw new Error('DB_DEV_URL is required in .env file');

createConnection(connection)
	.then(() => {
		app.listen(process.env.PORT || 3000, function() {
			console.log('Example app listening on port 3000!');
		});
	})
	.catch(error => console.log(error));

fetchPastMatch()
fetchUpcomingMatch()
fetchlivesMatch()
