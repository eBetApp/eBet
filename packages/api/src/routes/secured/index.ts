import user from './user';
import bet from './bet';
import { Router } from 'express';

const routes: Router = Router();

routes.use('/user', user);
routes.use('/bet', bet);

export default routes;
