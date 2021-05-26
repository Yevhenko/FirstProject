import express from 'express';
import { authRouter } from '../components/auth';
import { userRouter } from '../components/user';
import { auth } from '../components/auth/middlewares';
import { postRouter } from '../components/post';

export const router = express.Router();

router.use(authRouter.auth);
// router.use(auth);
router.use(userRouter.user);
router.use(postRouter.post);
