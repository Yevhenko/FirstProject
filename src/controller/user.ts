import { getUsersFromDb } from '../services/user';
import { NextFunction, Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | Error> => {
        const response = await getUsersFromDb();

        return res.json(response);
};
