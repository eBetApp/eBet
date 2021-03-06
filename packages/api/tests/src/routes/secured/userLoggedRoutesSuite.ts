import supertest from 'supertest';
import request from 'superagent';
import User from '../../../../src/database/models/User';

const userLoggedRoutesSuite = (server: supertest.SuperTest<supertest.Test>) =>
	describe('User routes', () => {
		// Create users to test user's routes
		const userToBeDeleted: User = new User();
		userToBeDeleted.nickname = 'Bob1';
		userToBeDeleted.password = 'bob1';
		userToBeDeleted.email = 'bob1@gmail.com';
		userToBeDeleted.birthdate = new Date('01/01/2000');

		const permanentUser: User = new User();
		permanentUser.nickname = 'Bob2';
		permanentUser.password = 'bob2';
		permanentUser.email = 'bob2@gmail.com';
		permanentUser.birthdate = new Date('01/01/2000');

		let userToBeDeletedToken: string, permanentUserToken: string;
		let userToBeDeletedUuid: string, permanentUserUuid: string;

		it('Should create 3 users for next tests', async done => {
			const res1: request.Response = await server
				.post('/api/auth/signup')
				.send(userToBeDeleted);
			userToBeDeletedToken = res1.body.meta.token;
			userToBeDeletedUuid = res1.body.data.user.uuid;

			const res2: request.Response = await server
				.post('/api/auth/signup')
				.send(permanentUser);
			permanentUserToken = res2.body.meta.token;
			permanentUserUuid = res2.body.data.user.uuid;

			expect(res1.status).toBe(201);
			expect(res2.status).toBe(201);
			done();
		});

		describe('GET USER route', () => {
			it('Should return of all users if existing token is given', async done => {
				const res: request.Response = await server
					.get(`/api/user/get/${userToBeDeletedUuid}`)
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${userToBeDeletedToken}`);
				expect(res.status).toBe(200);
				done();
			});
			it('Should return 401 if false token is given', async done => {
				const res: request.Response = await server
					.get(`/api/user/get/${userToBeDeletedUuid}`)
					.set('Accept', 'application/json')
					.set('Authorization', 'Bearer falseToken');
				expect(res.status).toBe(401);
				done();
			});
			it('Should return 401 of all users if token is not given', async done => {
				const res: request.Response = await server.get(
					`/api/user/get/${userToBeDeletedUuid}`,
				);
				expect(res.status).toBe(401);
				done();
			});
		});

		describe('DELETE route', () => {
			it('Should return 200 with existing token and uuid', async done => {
				const res: request.Response = await server
					.delete(`/api/user/delete/${userToBeDeletedUuid}`)
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${userToBeDeletedToken}`);
				expect(res.status).toBe(200);
				done();
			});
			it('Should return 403 with existing token but not existing uuid --> Unauthorized', async done => {
				const res: request.Response = await server
					.delete(`/api/user/delete/${userToBeDeletedUuid}`) // user1 is already deleted
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${permanentUserToken}`);
				expect(res.status).toBe(403);
				done();
			});
			it('Should return 500 if wrong token but existing uuid', async done => {
				const res: request.Response = await server
					.delete(`/api/user/delete/${permanentUserUuid}`)
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${userToBeDeletedToken}`);
				expect(res.status).toBe(500);
				done();
			});
		});

		describe('UPDATE route', () => {
			it('Should return 200 if correct token - uuid - nickname - email', async done => {
				const res: request.Response = await server
					.put('/api/user/update/')
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${permanentUserToken}`)
					.send({
						uuid: permanentUserUuid,
						nickname: 'newNickname',
						email: 'new@gmail.com',
						birthdate: new Date('2000-01-31'),
					});
				expect(res.status).toBe(200);
				done();
			});

			it('Should return 400 if correct token - uuid BUT empty nickname --> Format error', async done => {
				const res: request.Response = await server
					.put('/api/user/update/')
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${permanentUserToken}`)
					.send({
						uuid: permanentUserUuid,
						nickname: '', // incorrect
						email: 'new@gmail.com',
						birthdate: new Date('2000-01-31'),
					});
				expect(res.status).toBe(400);
				done();
			});

			it('Should return 400 if correct token - uuid BUT incorrect email --> Format error', async done => {
				const res: request.Response = await server
					.put('/api/user/update/')
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${permanentUserToken}`)
					.send({
						uuid: permanentUserUuid,
						nickname: 'newNickname',
						email: 'new@gmail', // incorrect
						birthdate: new Date('2000-01-31'),
					});
				expect(res.status).toBe(400);
				done();
			});

			it('Should return 400 if correct token - uuid BUT incorrect nickname AND email --> Format error', async done => {
				const res: request.Response = await server
					.put('/api/user/update/')
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${permanentUserToken}`)
					.send({
						uuid: permanentUserUuid,
						nickname: '', // incorrect
						email: 'new@gmail', // incorrect
						birthdate: new Date('2000-01-31'),
					});
				expect(res.status).toBe(400);
				done();
			});

			it('Should return 200 if correct token - uuid and PARTIAL data is given (nickname or email)', async done => {
				const resWithNoNickname: request.Response = await server
					.put('/api/user/update/')
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${permanentUserToken}`)
					.send({
						uuid: permanentUserUuid,
						email: 'new@gmail.com',
						// no nickname but required
						birthdate: new Date('2000-01-31'),
					});
				const resWithNoEmail: request.Response = await server
					.put('/api/user/update/')
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${permanentUserToken}`)
					.send({
						uuid: permanentUserUuid,
						email: 'new@gmail.com',
						// no nickname but required
						birthdate: new Date('2000-01-31'),
					});
				expect(resWithNoNickname.status).toBe(200);
				expect(resWithNoEmail.status).toBe(200);
				done();
			});

			it('Should return 400 if correct token BUT no UUID and incomplete data (nickname or email) --> BoddyError', async done => {
				const resWithNoNickname: request.Response = await server
					.put('/api/user/update/')
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${permanentUserToken}`)
					.send({
						// no ID
						email: 'new@gmail.com',
						// no nickname but required
						birthdate: new Date('2000-01-31'),
					});
				const resWithNoEmail: request.Response = await server
					.put('/api/user/update/')
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${permanentUserToken}`)
					.send({
						// no ID
						email: 'new@gmail.com',
						// no nickname but required
						birthdate: new Date('2000-01-31'),
					});
				expect(resWithNoNickname.status).toBe(400);
				expect(resWithNoEmail.status).toBe(400);
				done();
			});

			it('Should return 400 if correct token BUT no UUID --> BodyError', async done => {
				const res: request.Response = await server
					.put('/api/user/update/')
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${permanentUserToken}`)
					.send({
						// no ID
						nickname: 'newNickname', // incorrect
						email: 'new@gmail.com', // incorrect
						birthdate: new Date('2000-01-31'),
					});
				expect(res.status).toBe(400);
				done();
			});
		});
	});

export default userLoggedRoutesSuite;
