import express from 'express';
import { signin } from '../controller/login';

export const login = express.Router();

login.post('/auth/sign-in', signin);
