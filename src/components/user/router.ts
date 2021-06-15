import express from 'express';
import { validateRequest } from '@utils/requestValidation';
import { getQuerySchema } from '@utils/schemas';
import { getAllUsers } from './controller';

export const user = express.Router();

user.get('/users', validateRequest(getQuerySchema), getAllUsers);
