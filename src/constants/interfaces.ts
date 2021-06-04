import { Request } from 'express';
import { ZodObject } from 'zod';
import { User } from '@components/user';
import { constants } from './constatnts';

export interface ModifiedRequest extends Request {
  cookies: { [constants.COOKIES_KEY]: string };
  user?: User;
}

export interface RequestSchema {
  body?: ZodObject<any>;
  params?: ZodObject<any>;
  query?: ZodObject<any>;
}
