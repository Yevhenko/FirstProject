import { NextFunction, Request, Response } from 'express';
import { createUser, getUserByLogin, saveUserIdToSession } from '../../user/service/user';
import { setDataToRedis } from '../service/authService';
import { createHashedPassword } from '../../user/service/user';
import { constants } from '../../../constants';

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<Response | Error> => {
  const { body, sessionID, session } = req;
  const { login, password } = body;

  const hashedPass = await createHashedPassword(password);

  if (!login || !password) {
    return res.status(400).send('Bad request');
  }
  const user = await getUserByLogin(login);

  await setDataToRedis(sessionID, JSON.stringify(session));

  if (user) {
    await saveUserIdToSession(session, user.id);
    return res.status(403).send('User already exists');
  } else {
    const response = await createUser({ login, password: hashedPass });

    res.cookie(constants.COOKIES_KEY, sessionID);
    return res.json({ response });
  }
};
