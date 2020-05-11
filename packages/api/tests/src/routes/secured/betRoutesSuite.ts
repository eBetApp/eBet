import supertest from 'supertest';
import request from 'superagent';
import User from '../../../../src/database/models/User';

const betRoutesSuite = (server: supertest.SuperTest<supertest.Test>) => {
	describe('Test bet routes', () => {
		let user = new User();
		user.nickname = 'Bob1';
		user.password = 'bob1';
		user.email = 'bob1@gmail.com';

		let userToken: string;

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
	});
};

export default betRoutesSuite;
