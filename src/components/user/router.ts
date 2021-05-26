import express from 'express';
import { getAllUsers } from './controller';

export const user = express.Router();

user.get('/users', getAllUsers);
