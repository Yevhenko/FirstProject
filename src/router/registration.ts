import express from 'express';

import { signup } from "../controller/registration";

const registration = express.Router();

registration.post('/auth/sign-up', signup);

export = registration;