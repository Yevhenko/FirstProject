import express from 'express';
import { getAllUsers } from '../controller/user';

const user = express.Router();

user.get('/user', getAllUsers);

export = user;
