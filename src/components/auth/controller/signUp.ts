import { NextFunction, Request, Response } from 'express';
import { createUser, getUserByLogin, setDataToRedis } from '../../user/service/user';

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<Response | Error> => {
  const { body, session, sessionID } = req;
  const { login, password } = body;

  if (!login || !password) {
    return res.status(400).send('Bad request');
  }
  const user = await getUserByLogin(login);

  if (user) {
    return res.status(403).send('User already exists');
  } else {
    await setDataToRedis(sessionID, sessionID);
    const response = await createUser(body);
    res.cookie('id', sessionID);
    return res.json({ response });
  }
};
