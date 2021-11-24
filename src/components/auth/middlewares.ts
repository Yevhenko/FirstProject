import { NextFunction, Request, Response } from 'express';
import { constants } from '@constants/constants';
import { userService } from '@components/user';
import { getDataFromRedis } from './services';

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { cookies } = req;

  const sessionId = cookies[constants.COOKIES_KEY];

  if (!sessionId) {
    return res.status(401).json('no proper cookie');
  }
  const data = await getDataFromRedis(sessionId);

  if (data !== null) {
    const session = JSON.parse(data);
    const user = await userService.getUserByIdFromDb(session.userId);

    if (user.length === 0) return res.status(500).json('user not found');

    req.user = user[0];
    return next();
  }
  return res.status(401).json('invalid sign-in');
};
