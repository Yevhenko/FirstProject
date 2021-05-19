import { NextFunction, Request, Response } from 'express';
import { getUsersFromDb } from '../service/user';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | Error> => {
  const response = await getUsersFromDb();

  return res.json(response);
};
