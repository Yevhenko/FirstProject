import { User } from '../user/models/User';

export interface IPost {
  id?: number;
  title: string;
  text: string;
  user: User;
}
