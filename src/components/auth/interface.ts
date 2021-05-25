import 'express-session';
import { postInterface } from '../post';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    post: postInterface.IPost;
  }
}
