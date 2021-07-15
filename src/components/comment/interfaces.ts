import { Post } from '@components/post';
import { User } from '@components/user';

export interface IComment {
  id?: number;
  text: string;
  user: User;
  post: Post;
}
