import { NextFunction, Request, Response } from 'express';
import { ModifiedRequest } from '../interface';
import { getUsersFromDb } from './services';

export const getAllUsers = async (req: ModifiedRequest, res: Response, next: NextFunction): Promise<Response> => {
  const {
    query: { offset, limit },
  } = req;

  const skip = Number(offset);
  const perPage = Number(limit);

  const response = await getUsersFromDb(skip, perPage);

  return res.json(response);
};
