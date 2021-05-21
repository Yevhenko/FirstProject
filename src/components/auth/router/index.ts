import express from 'express';
import { signIn, signUp } from '../controller/controller';

export const auth = express.Router();

auth.post('/auth/sign-in', signIn).post('/auth/sign-up', signUp);
