import express from 'express';
import { signIn } from '../controller/signIn';

export const logIn = express.Router();

logIn.post('/auth/sign-in', signIn);
