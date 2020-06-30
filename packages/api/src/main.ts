import 'reflect-metadata';
require('dotenv').config();
// Check .env file
import './credentials';
// ORM
import { createConnection } from 'typeorm';
// INTERNALS
import app from './core/app';
// import User from './database/models/User';
import connection from './database/connection';
import { startSchedule } from './services/pandaScoreApi/apiFetchs';

if (process.env.DB_DEV_URL == null)
	throw new Error('DB_DEV_URL is required in .env file');

createConnection(connection)
	.then(() => {
		app.listen(process.env.PORT, function() {
			console.log(`App listening on ${process.env.HOST}!`);
		});
	})
	.catch(error => console.log(error));

startSchedule();
