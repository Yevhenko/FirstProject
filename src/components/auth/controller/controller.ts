import { NextFunction, Request, Response } from 'express';
import { userService } from '../../user/index';
import { setDataToRedis } from '../service/services';
import { constants } from '../../../constants/constatnts';

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { body, sessionID } = req;
  const { login, password } = body;

  if (!login || !password) {
    return res.status(400).send('Bad request');
  }
  const user = await userService.getUserByLogin(login);

  if (!user) return res.status(403).send('Login or password mismatch');

  const passwordMatch = await userService.compareHashedPasswords(password, user.password);

  if (!passwordMatch) {
    return res.status(404).send('auth failed');
  } else {
    await setDataToRedis(sessionID, sessionID);
    res.cookie(constants.COOKIES_KEY, sessionID);

    return res.send({ status: 'logged-in' });
  }
};

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<Response | Error> => {
  const { body, sessionID } = req;
  const { login, password } = body;

  const hashedPass = await userService.createHashedPassword(password);

  if (!login || !password) {
    return res.status(400).send('Bad request');
  }
  const user = await userService.getUserByLogin(login);

  if (user) {
    return res.status(403).send('User already exists');
  } else {
    await setDataToRedis(sessionID, sessionID);
    const response = await userService.createUser({ login, password: hashedPass });
    res.cookie(constants.COOKIES_KEY, sessionID);
    return res.json({ response });
  }
};
