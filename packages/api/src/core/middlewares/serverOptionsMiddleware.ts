// SERVER
import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// PASSPORT
import passport from 'passport';
// INTERNALS
import Routes from '../../routes';

const serverOptionsMiddleware = (app: Application): void => {
	app.use(passport.initialize());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(cors());
	app.use('/api', Routes);
	app.get('/', (req, res) => res.status(200).end('Type /api to use it'));
};

export default serverOptionsMiddleware;
