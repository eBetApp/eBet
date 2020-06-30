import user from './user';
import bet from './bet';
import payments from './stripe';
import { Router } from 'express';

const routes: Router = Router();

routes.use('/user', user);
routes.use('/bet', bet);
routes.use('/payments', payments);

export default routes;
