// SERVER
import { Application } from 'express';
// SWAGGER
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const graphQlMiddleware = (app: Application): void => {
	const options = {
		swaggerDefinition: {
			openapi: '3.0.0',
			info: {
				title: 'API eBet - Documentation',
				version: '1.0.0',
			},
			servers: [
				{
					url: `${process.env.HOST}/api/`,
				},
			],
		},
		apis: ['./doc/Global.yml', './doc/User.yml', './doc/Bet.yml'],
	};
	const specs = swaggerJsdoc(options);
	app.use('/doc', swaggerUi.serve);
	app.get(
		'/doc',
		swaggerUi.setup(specs, {
			explorer: true,
		}),
	);
};

export default graphQlMiddleware;
