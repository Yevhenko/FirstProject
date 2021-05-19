import express from 'express';
import { getAllUsers } from '../controller/user';

export const user = express.Router();

user.get('/user', getAllUsers);
