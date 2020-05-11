import supertest from 'supertest';
// ORM
import { createConnection, Connection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
// INTERNALS
import app from '../../../src/core/app';
import User from '../../../src/database/models/User';
import Bet from '../../../src/database/models/Bet';
import authRoutesSuite from './authRoutesSuite';
import graphQlAuthRoutesSuite from './graphQlAuthRoutesSuite';
import userLoggedRoutesSuite from './secured/userLoggedRoutesSuite';
import betRoutesSuite from './secured/betRoutesSuite';

let connection: Connection;

const server: supertest.SuperTest<supertest.Test> = supertest(app);

describe('Tests to run sequentially in cleaned database', () => {
	it('Create connection to database (instruction - not a test)', async done => {
		if (process.env.DB_TEST_URL == null)
			throw new Error('DB_TEST_URL is required in .env file');

		const options: PostgresConnectionOptions = {
			name: 'main',
			type: 'postgres',
			url: process.env.DB_TEST_URL,
			synchronize: true,
			logging: false,
			uuidExtension: 'uuid-ossp',
			entities: [User, Bet],
			extra: {
				ssl: process.env.DB_TEST_SSL === 'true',
			},
		};

		connection = await createConnection(options);

		done();
	});

	it('(instruction - not a test) Close database connection', async done => {
		await connection.dropDatabase();
		await connection.close();
		await connection.connect();
		done();
	});
	authRoutesSuite(server);

	it('(instruction - not a test) Close database connection', async done => {
		await connection.dropDatabase();
		await connection.close();
		await connection.connect();
		done();
	});
	graphQlAuthRoutesSuite(server);

	it('(instruction - not a test) Close database connection', async done => {
		await connection.dropDatabase();
		await connection.close();
		await connection.connect();
		done();
	});
	userLoggedRoutesSuite(server);

	it('(instruction - not a test) Close database connection', async done => {
		await connection.dropDatabase();
		await connection.close();
		await connection.connect();
		done();
	});
	betRoutesSuite(server);

	it('(instruction - not a test) Close database connection', async done => {
		await connection.close();
		done();
	});
});
