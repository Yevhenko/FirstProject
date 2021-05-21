import { NextFunction, Request, Response } from 'express';
import { getUsersFromDb } from '../service/service';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const {
    query: { offset, limit },
  } = req;

  const skip = Number(offset);
  const perPage = Number(limit);

  const response = await getUsersFromDb(skip, perPage);

  return res.json(response);
};
