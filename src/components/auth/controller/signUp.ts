import { NextFunction, Request, Response } from 'express';
import { createUser, getUserByLogin } from '../../user/service/user';
import { setDataToRedis } from '../service/authService';
import { createHashedPassword } from '../../user/service/user';

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<Response | Error> => {
  const { body, sessionID } = req;
  const { login, password } = body;

  const hashedPass = await createHashedPassword(password);

  if (!login || !password) {
    return res.status(400).send('Bad request');
  }
  const user = await getUserByLogin(login);

  if (user) {
    return res.status(403).send('User already exists');
  } else {
    await setDataToRedis(sessionID, sessionID);
    const response = await createUser({ login, password: hashedPass });
    res.cookie('connect.sid', sessionID);
    return res.json({ response });
  }
};
