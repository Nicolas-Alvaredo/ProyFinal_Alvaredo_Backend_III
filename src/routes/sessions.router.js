import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

router.post('/register',sessionsController.register);
router.post('/login',sessionsController.login);
router.get('/current',sessionsController.current);
router.get('/logout', sessionsController.logout);
router.post('/unprotectedLogin',sessionsController.unprotectedLogin);
router.get('/unprotectedCurrent',sessionsController.unprotectedCurrent);
router.get('/unprotectedLogout', sessionsController.unprotectedLogout);


export default router;