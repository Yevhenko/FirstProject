import { NextFunction, Response } from 'express';
import { ModifiedRequest } from '../constants/interface';
import { paramsSchema, postBodySchema, querySchema, userBodySchema } from './schemas';

export const validateBody =
  (schema: typeof userBodySchema | typeof postBodySchema) =>
  async (req: ModifiedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    const data = await schema.safeParseAsync(req.body);
    if (!data.success) {
      return res.status(400).send(data.error);
    }
    return next();
  };

export const validateParams =
  (schema: typeof paramsSchema) =>
  async (req: ModifiedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    const data = await schema.safeParseAsync(req.params);
    if (!data.success) {
      return res.status(400).send(data.error);
    }
    return next();
  };

export const validateQuery =
  (schema: typeof querySchema) =>
  async (req: ModifiedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    const data = await schema.safeParseAsync(req.query);
    if (!data.success) {
      return res.status(400).send(data.error);
    }
    return next();
  };
