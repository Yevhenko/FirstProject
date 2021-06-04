import express from 'express';
import { validateRequest } from '@utils/requestValidation';
import { userSchemas } from '@components/user';
import { signIn, signUp } from './controller';

export const auth = express.Router();

auth.post('/auth/sign-in', validateRequest(userSchemas.createUserSchema), signIn);
auth.post('/auth/sign-up', validateRequest(userSchemas.createUserSchema), signUp);
