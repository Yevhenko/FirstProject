import express from 'express';
import { signUp } from '../controller/signUp';

export const registration = express.Router();

registration.post('/auth/sign-up', signUp);
