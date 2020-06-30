import { Router } from 'express';
import StripeController from '../../controllers/rest/StripeController';

const router: Router = Router();

router.post('/set-account', StripeController.setAccount);
router.get('/get-create-account-url', StripeController.getCreateAccountUrl);
router.put('/load-account', StripeController.loadAccount);
router.post('/charge', StripeController.chargeCreditCard);
router.post('/account-balance', StripeController.getAccountBalance); // POST because body is forbidden with GET
router.get('/get-secret', StripeController.getProductSecret);

export default router;
