import supertest from 'supertest';
import request from 'superagent';
import User from '../../../../src/database/models/User';
import Bet from '../../../../src/database/models/Bet';
import { getMaxListeners } from 'cluster';

const betRoutesSuite = (server: supertest.SuperTest<supertest.Test>) => {
	describe('Test bet routes', () => {
		let user = new User();
		user.nickname = 'Bob1';
		user.password = 'bob1';
		user.email = 'bob1@gmail.com';
		user.birthdate = new Date('2000-01-31');

		let userToken: string;

		let bet = new Bet();

		it('(instruction - not a test) Create user to manipulate', async done => {
			const res = await server.post('/api/auth/signup').send(user);

			userToken = res.body.meta.token;
			user.uuid = res.body.data.user.uuid;

			done();
		});

		describe('/api/user/get-bets/:userUuid', () => {
			it('Should return 200 && user && its bets - if existing token and corresponding userUuid are given', async done => {
				const res: request.Response = await server
					.get(`/api/user/get-bets/${user.uuid}`)
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${userToken}`);
				expect(res.status).toBe(200);
				done();
			});

			it('Should return 401 - if unexisting token is given', async done => {
				const res: request.Response = await server
					.get(`/api/user/get-bets/${user.uuid}`)
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${userToken}fake`);
				expect(res.status).toBe(401);
				done();
			});

			it('Should return 403 - if existing token and uncorresponding userUuid are given', async done => {
				const res: request.Response = await server
					.get(`/api/user/get-bets/${user.uuid}123`)
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${userToken}`);
				expect(res.status).toBe(403);
				done();
			});
		});
		describe('/api/bet/create/:userUuid', () => {
			it('Should return 201 && bet && its user - if existing token and corresponding userUuid are given', async done => {
				const res: request.Response = await server
					.post(`/api/bet/create/${user.uuid}`)
					.send({ name: 'My first bet' })
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${userToken}`);
				expect(res.status).toBe(201);

				bet.uuid = res.body.data.bet.uuid;
				bet.name = res.body.data.name;

				done();
			});
		});
		describe('/api/bet/get/:betUuid', () => {
			it('Should return 200 && bet && its user - if existing token and corresponding betUuid are given', async done => {
				const res: request.Response = await server
					.get(`/api/bet/get/${bet.uuid}`)
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${userToken}`);
				expect(res.status).toBe(200);
				done();
			});

			it('Should return 403 - if asking for bet of another user', async done => {
				// ARRANGE
				const otherUser = await server.post('/api/auth/signup').send({
					nickname: 'other',
					email: 'other@gmail.com',
					birthdate: new Date('2000-01-01'),
					password: 'other',
				});

				// ACT
				const res: request.Response = await server
					.get(`/api/bet/get/${bet.uuid}`)
					.set('Accept', 'application/json')
					.set(
						'Authorization',
						`Bearer ${otherUser.body.meta.token}`,
					);

				// ASSERT
				expect(res.status).toBe(403);
				done();
			});
		});
		describe('/api/bet/delete/:betUuid', () => {
			it('Should return 403 - if asking for bet of another user', async done => {
				// ARRANGE
				const otherUser = await server.post('/api/auth/signup').send({
					nickname: 'otherDelete',
					email: 'otherDelete@gmail.com',
					birthdate: new Date('2000-01-01'),
					password: 'otherDelete',
				});

				// ACT
				const res: request.Response = await server
					.delete(`/api/bet/delete/${bet.uuid}`)
					.set('Accept', 'application/json')
					.set(
						'Authorization',
						`Bearer ${otherUser.body.meta.token}`,
					);

				// ASSERT
				expect(res.status).toBe(403);
				done();
			});

			it('Should return 200 && user && its bets - if existing token and corresponding userUuid are given', async done => {
				const res: request.Response = await server
					.delete(`/api/bet/delete/${bet.uuid}`)
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${userToken}`);
				expect(res.status).toBe(200);
				done();
			});

			it('Should return 404 - if asking for delete already deleted bet', async done => {
				const res: request.Response = await server
					.delete(`/api/bet/delete/${bet.uuid}`)
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${userToken}`);
				expect(res.status).toBe(404);
				done();
			});
		});
	});
};

export default betRoutesSuite;
