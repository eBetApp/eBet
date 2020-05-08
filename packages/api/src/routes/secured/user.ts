// EXPRESS
import { Router } from 'express';
// INTERNALS
import UserController from '../../controllers/rest/UserController';

const router: Router = Router();

router.get('/get/:uuid', UserController.get)
router.put('/update', UserController.update)
router.put('/update-password', UserController.updatePwd)
router.put('/update-avatar', UserController.updateAvatar)
router.delete('/delete/:uuid', UserController.delete)
router.delete('/delete-avatar/:fileKey', UserController.deleteAvatar)

export default router;
