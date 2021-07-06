import { constants } from '@constants/constants';
import { User } from '@components/user';
import { Post } from '@components/post';

declare global {
  namespace Express {
    interface Request {
      cookies: { [constants.COOKIES_KEY]: string };
      user: User;
      post: Post;
    }
  }
}
