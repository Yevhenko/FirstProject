import { NextFunction, Response } from 'express';
import { userInterface } from './index';
import { getUsersFromDb } from './services';

export const getAllUsers = async (
  req: userInterface.ModifiedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const {
    query: { offset, limit },
  } = req;

  console.log(req);

  const skip = Number(offset);
  const perPage = Number(limit);

  const response = await getUsersFromDb(skip, perPage);

  return res.json(response);
};
