import express from 'express';
import { signIn, signUp } from './controller';
import { validateRequest } from '../../utils/requestValidation';
import { userSchema } from '../../utils/schemas';

export const auth = express.Router();

auth.post('/auth/sign-in', validateRequest(userSchema), signIn);
auth.post('/auth/sign-up', validateRequest(userSchema), signUp);
