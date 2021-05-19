import express from 'express';
import { signup } from '../controller/registration';

export const registration = express.Router();

registration.post('/auth/sign-up', signup);
