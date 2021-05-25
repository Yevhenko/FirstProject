import { Request } from 'express';
import { constants } from '../../constants/constatnts';
import { User } from './models/User';

export interface ModifiedRequest extends Request {
  cookies: { [constants.COOKIES_KEY]: string };
  user?: User;
}

export interface IUser {
  id?: number;
  login: string;
  password?: string;
  sessionID?: string;
}
