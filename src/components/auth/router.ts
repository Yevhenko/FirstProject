import express from 'express';
import { signIn, signUp } from './controller';
import { validateBody } from '../../utils/requestValidation';
import { userBodySchema } from '../../utils/schemas';

export const auth = express.Router();

auth.post('/auth/sign-in', validateBody(userBodySchema), signIn);
auth.post('/auth/sign-up', validateBody(userBodySchema), signUp);
