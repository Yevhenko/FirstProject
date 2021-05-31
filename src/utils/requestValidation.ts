import { NextFunction, Response } from 'express';
import * as zod from 'zod';
import { ModifiedRequest } from '../constants/interface';
import { userSchema, postSchema } from './schemas';

export const validateRequest =
  (schema: typeof userSchema | typeof postSchema) =>
  async (req: ModifiedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    const data = schema.parse(req.body);
    if (!data) {
      res.send('Validation Error');
      throw new zod.ZodError([]);
    }
    return next();
  };
