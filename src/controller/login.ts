import { getUserByLogin } from '../services/user';
import { NextFunction, Request, Response } from "express";

export const signin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const { body, sessionID, session } = req;

        const { login, password } = body;

        if (!login || !password) {
            return res.status(400).send('Bad request');
        }
        const user = await getUserByLogin(login);

        if (!user) return res.status(403).send('Login or password mismatch');

        if (user.password !== password) {
            return res.status(404).send('auth failed');
        };

        res.cookie('id', sessionID);

        return res.send({session, status: 'logged-in'});

};
