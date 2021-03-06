// ORM
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
// INTERNALS
import User from '../database/models/User';
import Bet from './models/Bet';

if (process.env.DB_DEV_URL == null)
	throw new Error('DB_DEV_URL is required in .env file');

const connection: PostgresConnectionOptions = {
	name: 'main',
	type: 'postgres',
	url: process.env.DB_DEV_URL,
	synchronize: true,
	logging: false,
	uuidExtension: 'uuid-ossp',
	entities: [User, Bet],
	extra: {
		ssl: process.env.DB_DEV_SSL === 'true',
	},
};

export default connection;
