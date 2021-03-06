import { Router } from 'express';
import AuthController from '../controllers/rest/AuthController';

const router: Router = Router();

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);

export default router;
