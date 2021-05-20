import 'express';

declare module 'express' {
  interface Request {
    user?: IUser;
  }
}

export interface IUser {
  id?: number;
  login: string;
  password?: string;
  sessionID?: string;
}
