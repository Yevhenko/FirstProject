import { Request } from 'express';
import { constants } from '../../../constants';

export interface ModifiedRequest extends Request {
  cookies: { [constants.COOKIES_KEY]: string };
  user?: IUser;
}

export interface IUser {
  id?: number;
  login: string;
  password?: string;
  sessionID?: string;
}
