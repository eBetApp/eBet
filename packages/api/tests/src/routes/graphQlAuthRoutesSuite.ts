import supertest from 'supertest';
import request from 'superagent';

const resolversRealTest = (server: supertest.SuperTest<supertest.Test>) =>
	describe('GraphQL - Auth routes', () => {
		describe('GraphQL - Sign Up routes', () => {
			it('Sign Up with correct data should return 200 and body should contains a User', async done => {
				const query = `mutation {
					signUp(nickname: "bobi22", email: "bob@gmail.com", password: "boob1")
					{uuid, nickname, email}
				}`;
				const res: request.Response = await server
					.post('/graphql')
					.set('Accept', 'application/json')
					.send({ query });
				console.log('res.body.errors');
				console.log(res.body.errors);
				expect(res.status).toBe(200);
				expect(res.body.data).toBeDefined();
				expect(res.body.errors).toBeUndefined();
				done();
			});
			it('Sign Up with an already used nickname should return 200 AND body should contains errors', async done => {
				const query = `mutation {
				signUp(nickname: "bobi22", email: "bob@gmail.com", password: "boob1")
				{uuid, nickname, email}
			}`;
				const res: request.Response = await server
					.post('/graphql')
					.set('Accept', 'application/json')
					.send({ query });
				expect(res.status).toBe(200);
				expect(res.body.data).toBeDefined();
				expect(res.body.errors).toBeDefined();
				expect(res.body.errors[0].extensions.code).toBe(
					'UNAUTHENTICATED',
				);
				done();
			});
		});
	});

export default resolversRealTest;
