import { NextFunction, Response } from 'express';
import { userService } from '../user';
import { setDataToRedis } from './services';
import { constants } from '../../constants/constatnts';
import { userInterface } from '../user';

export const signUp = async (
  req: userInterface.ModifiedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | Error> => {
  const { body, sessionID, session } = req;
  const { login, password } = body;

  const hashedPass = await userService.createHashedPassword(password);

  if (!login || !password) {
    return res.status(400).send('Bad request');
  }
  const existingUser = await userService.getUserByLogin(login);

  if (existingUser) {
    return res.status(403).send('User already exists');
  } else {
    const response = await userService.createUser({ login, password: hashedPass });
    session.userId = response.id;
    await setDataToRedis(sessionID, JSON.stringify(session));

    res.cookie(constants.COOKIES_KEY, sessionID);
    return res.json({ response });
  }
};

export const signIn = async (
  req: userInterface.ModifiedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const { body, sessionID, session } = req;
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
    await userService.saveUserIdToSession(session, user.id);
    await setDataToRedis(sessionID, JSON.stringify(session));
    res.cookie(constants.COOKIES_KEY, sessionID);

    return res.send({ status: 'logged-in' });
  }
};
