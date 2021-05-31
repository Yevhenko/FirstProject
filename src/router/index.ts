import express from 'express';
import { authRouter } from '@components/auth';
import { userRouter } from '@components/user';
import { authMiddlewares } from '@components/auth';
import { postRouter } from '@components/post';

export const router = express.Router();

router.use(authRouter.auth);
router.use(authMiddlewares.auth);
router.use(userRouter.user);
router.use(postRouter.post);
