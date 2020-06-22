import { Router } from 'express';
import StripeController from '../../controllers/rest/StripeController';

const router: Router = Router();

router.post('/set-account', StripeController.setAccount);
router.get('/get-create-account-url', StripeController.getCreateAccountUrl);
router.put('/load-account', StripeController.loadAccount); // TODO: ajouter une protection particulière? un token administrateur?
router.post('/charge', StripeController.chargeCreditCard);
router.get('/account-balance', StripeController.getAccountBalance);
router.get('/get-secret', StripeController.getProductSecret);

export default router;
