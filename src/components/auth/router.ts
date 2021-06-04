import express from 'express';
import { signIn, signUp } from './controller';
import { validateRequest } from '../../utils/requestValidation';
import { createUserSchema } from '../../utils/schemas';

export const auth = express.Router();

auth.post('/auth/sign-in', validateRequest(createUserSchema), signIn);
auth.post('/auth/sign-up', validateRequest(createUserSchema), signUp);
