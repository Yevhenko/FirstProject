import {NextFunction, Request, Response} from "express";
import {getDataFromRedis} from "../services/user";

export const auth = async (req: Request, res:Response, next: NextFunction) => {
  try {
    const {cookies} = req;
    const key: any = Object.values(cookies)[0];

    const data = await getDataFromRedis(key);

    if (data === key) {
      return next();
    }
    return res.status(404).send('login please');
  } catch (error) {
    throw new Error(error);
  }
};
