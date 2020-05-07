// EXPRESS
import express, { Express } from 'express';
// MIDDLEWARES
import graphQlMiddleware from './middlewares/graphQlMiddleware'
import serverOptionsMiddleware from './middlewares/serverOptionsMiddleware'
import swaggerMiddleware from './middlewares/swaggerMiddleware'
import './middlewares/passportMiddleware'

const app: Express = express();
serverOptionsMiddleware(app);
swaggerMiddleware(app);
graphQlMiddleware(app);

export default app;
