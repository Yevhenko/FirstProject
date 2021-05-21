import express from 'express';
import { signUp } from '../controller/signUp';
import { signIn } from '../controller/signIn';

export const registration = express.Router();
export const logIn = express.Router();

registration.post('/auth/sign-up', signUp);
logIn.post('/auth/sign-in', signIn);
