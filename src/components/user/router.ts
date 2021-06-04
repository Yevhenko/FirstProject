import express from 'express';
import { getAllUsers } from './controller';
import { validateRequest } from '../../utils/requestValidation';
import { getQuerySchema } from '../../utils/schemas';

export const user = express.Router();

user.get('/users', validateRequest(getQuerySchema), getAllUsers);
