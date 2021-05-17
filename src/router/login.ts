import express from 'express';
import { signin } from '../controller/login';

const login = express.Router();

login.post('/auth/sign-in', signin);

export = login;