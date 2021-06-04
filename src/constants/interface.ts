import { Request } from 'express';
import { constants } from './constatnts';
import { ZodObject, ZodType } from 'zod';
import { User } from '../components/user/models/User';

export interface ModifiedRequest extends Request {
  cookies: { [constants.COOKIES_KEY]: string };
  user?: User;
}

export interface RequestSchema {
  body?: ZodObject<any>;
  params?: ZodObject<any>;
  query?: ZodObject<any>;
}
