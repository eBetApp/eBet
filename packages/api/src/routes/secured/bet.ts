// EXPRESS
import { Router } from 'express';
// INTERNALS
import BetController from '../../controllers/rest/BetController';

const router: Router = Router();

router.post('/create/:userUuid', BetController.create);
router.get('/get/:betUuid', BetController.get);
router.delete('/delete/:uuid', BetController.delete); // TODO

export default router;
