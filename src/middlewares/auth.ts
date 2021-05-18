import {NextFunction, Request, Response} from "express";

export const auth = async (req: Request, res:Response, next: NextFunction) => {

  if (req.cookies) return next();
  return res.status(404).send('login please');
};
