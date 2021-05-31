import { Request } from 'express';
import { constants } from './constatnts';
import { User } from '../components/user/models/User';

export interface ModifiedRequest extends Request {
  cookies: { [constants.COOKIES_KEY]: string };
  user?: User;
}
