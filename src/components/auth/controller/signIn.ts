import { NextFunction, Request, Response } from 'express';
import { getUserByLogin, saveUserIdToSession } from '../../user/service/user';
import { setDataToRedis } from '../service/authService';
import { compareHashedPasswords } from '../../user/service/user';
import { constants } from '../../../constants';

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { body, sessionID, session } = req;
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
    await saveUserIdToSession(session, user.id);
    await setDataToRedis(sessionID, JSON.stringify(session));
    res.cookie(constants.COOKIES_KEY, sessionID);

    return res.send({ status: 'logged-in' });
  }
};
