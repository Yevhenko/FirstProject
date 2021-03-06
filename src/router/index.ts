import express from 'express';
import { auth } from '../components/auth/middlewares/auth';
import { logIn } from '../components/auth/router/logIn';
import { registration } from '../components/auth/router/registration';
import { user } from '../components/user/router/user';

export const router = express.Router();

router.use(registration);
router.use(logIn);
router.use(auth);
router.use(user);
