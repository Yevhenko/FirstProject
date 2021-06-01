import express from 'express';
import { getAllUsers } from './controller';
import { validateQuery } from '../../utils/requestValidation';
import { querySchema } from '../../utils/schemas';

export const user = express.Router();

user.get('/users', validateQuery(querySchema), getAllUsers);
