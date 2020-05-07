// EXPRESS
import { Router } from 'express';
// PASSPORT
import passport from 'passport';
// INTERNALS
import auth from './auth';
import secured from './secured/';

const routes: Router = Router();

routes.use('/auth', auth);
routes.use('/', passport.authenticate('jwt', { session: false }), secured);

export default routes;
