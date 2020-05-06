import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './app';
import User from './entity/User';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
require('dotenv').config();

if (process.env.DB_DEV_URL == null)
	throw new Error('DB_DEV_URL is required in .env file');

const pgOptions: PostgresConnectionOptions = {
	name: 'main',
	type: 'postgres',
	url: process.env.DB_DEV_URL,
	synchronize: true,
	logging: false,
	uuidExtension: 'uuid-ossp',
	entities: [User],
	extra: {
		ssl: process.env.DB_DEV_SSL === 'true',
	},
};

createConnection(pgOptions)
	.then(() => {
		app.listen(process.env.PORT || 3000, function() {
			console.log('Example app listening on port 3000!');
		});
	})
	.catch(error => console.log(error));
