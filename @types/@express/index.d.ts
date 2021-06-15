import { constants } from '@constants/constatnts';
import { User } from '@components/user';

declare global {
  namespace Express {
    interface Request {
      cookies: { [constants.COOKIES_KEY]: string };
      user: User;
    }
  }
}