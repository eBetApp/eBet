// EXPRESS
import { Router } from 'express';
// INTERNALS
import BetController from '../../controllers/rest/BetController';

const router: Router = Router();

router.post('/create/:userUuid', BetController.create);
router.get('/get/:betUuid', BetController.get);
router.delete('/delete/:betUuid', BetController.delete);

export default router;
