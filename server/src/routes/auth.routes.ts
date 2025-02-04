import { Router } from 'express';
import { login, logout, refreshAccessToken, register } from '../controllers/auth.controller';
import { verifyJWT } from '../middlewares/auth.middleware';


const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(verifyJWT,logout);
router.route('/refresh-token').post(refreshAccessToken)




export default router;