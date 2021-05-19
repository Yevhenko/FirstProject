import { NextFunction, Request, Response } from 'express';
import { getUserByLogin } from '../../user/service/user';
import { setDataToRedis } from '../service/authService';
import { compareHashedPasswords } from '../../user/service/user';

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { body, sessionID } = req;
  const { login, password } = body;

  if (!login || !password) {
    return res.status(400).send('Bad request');
  }
  const user = await getUserByLogin(login);

  if (!user) return res.status(403).send('Login or password mismatch');

  const passwordMatch = await compareHashedPasswords(password, user.password);

  if (!passwordMatch) {
    return res.status(404).send('auth failed');
  } else {
    await setDataToRedis(sessionID, sessionID);
    res.cookie('connect.sid', sessionID);

    return res.send({ status: 'logged-in' });
  }
};
