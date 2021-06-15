import { ZodObject } from 'zod';

export interface RequestSchema {
  body?: ZodObject<any>;
  params?: ZodObject<any>;
  query?: ZodObject<any>;
}
