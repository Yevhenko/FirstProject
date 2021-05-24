import express from 'express';
import { authRouter } from '../components/auth/index';
import { userRouter } from '../components/user/index';
import { auth } from '../components/auth/middlewares';

export const router = express.Router();

router.use(authRouter.auth);
router.use(auth);
router.use(userRouter.user);
