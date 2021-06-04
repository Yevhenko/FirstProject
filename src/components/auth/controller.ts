import { Request, Response } from 'express';
import { userService } from '@components/user';
import { constants } from '@constants/constatnts';
import { setDataToRedis } from './services';

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  const { body, sessionID, session } = req;
  const { login, password } = body;

  const existingUser = await userService.getUserByLogin(login);
  const hashedPass = await userService.createHashedPassword(password);

  if (existingUser) {
    return res.status(403).send('User already exists');
  } else {
    const user = await userService.createUser({ login, password: hashedPass });
    session.userId = user.id;
    await setDataToRedis(sessionID, JSON.stringify(session));

    res.cookie(constants.COOKIES_KEY, sessionID);

    return res.json({ id: user.id, login: user.login });
  }
};

export const signIn = async (req: Request, res: Response): Promise<Response | void> => {
  const { body, sessionID, session } = req;
  const { login, password } = body;

  const user = await userService.getUserByLogin(login);

  if (!user) return res.status(403).send('Login or password mismatch');
  const passwordMatch = await userService.compareHashedPasswords(password, user.password);

  if (!passwordMatch) {
    return res.status(403).send('Login or password mismatch');
  } else {
    session.userId = user.id;
    await setDataToRedis(sessionID, JSON.stringify(session));
    res.cookie(constants.COOKIES_KEY, sessionID);

    return res.status(200).send();
  }
};
