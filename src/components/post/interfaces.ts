import { User } from '@components//user';

export interface IPost {
  id?: number;
  title: string;
  text: string;
  user: User;
}
