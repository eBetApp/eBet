// EXPRESS
import { Router } from 'express';
// INTERNALS
import BetController from '../../controllers/rest/BetController';

const router: Router = Router();

router.post('/create/:userUuid', BetController.create);
router.get('/get/one/:betUuid', BetController.get);
router.get('/get/user/:userUuid', BetController.getByUser);
router.get('/get/live', BetController.live);
router.get('/get/upcoming', BetController.upcoming);
router.get('/get/past/:userUuid', BetController.past);
router.delete('/delete/:betUuid', BetController.delete);

export default router;
