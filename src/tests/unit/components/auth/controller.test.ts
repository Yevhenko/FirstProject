import { Request, Response } from 'express';
import { signUp, signIn } from '@components/auth/controller';
import { userService } from '@components/user';
import { setDataToRedis } from '@components/auth/services';
import { compareHashedPasswords, createHashedPassword, createUser, getUserByLogin } from '@components/user/services';

jest.mock('@components/user/services', () => {
  return {
    createUser: jest.fn(),
    getUserByLogin: jest.fn(),
    createHashedPassword: jest.fn(),
    compareHashedPasswords: jest.fn(),
    deletePostFromDb: jest.fn(),
    getUserIdOfThePost: jest.fn(),
  };
});

jest.mock('@components/auth/services', () => {
  return {
    setDataToRedis: jest.fn(),
  };
});

describe('testing auth controller', () => {
  const mUser = {
    id: 1,
    login: 'Yevhenko',
    password: '123abc',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const mHashedPass = 'hashed';
  const session = {};
  const body = { login: 'Yevhenko', password: '123abc' };

  describe.skip('sign-up', () => {
    it('user already exists', async () => {
      const mReq = { body, sessionID: 'sessionID', session };
      let mRes: any;
      mRes = {
        send: jest.fn(),
        status: jest.fn(() => mRes),
      };

      (userService.getUserByLogin as jest.MockedFunction<any>).mockResolvedValue(mUser);
      (userService.createHashedPassword as jest.MockedFunction<any>).mockResolvedValue(mHashedPass);

      await signUp(mReq as unknown as Request, mRes as unknown as Response);

      expect(getUserByLogin).toHaveBeenCalledWith(mUser.login);
      expect(mRes.status).toHaveBeenCalledWith(403);
      expect(mRes.send).toHaveBeenCalledWith('User already exists');
    });

    it('success case', async () => {
      const mReq = { body, sessionID: 'sessionID', session };
      let mRes: any;
      mRes = {
        json: jest.fn(),
        cookie: jest.fn(),
      };

      (userService.createUser as jest.MockedFunction<any>).mockResolvedValue(mUser);
      (userService.getUserByLogin as jest.MockedFunction<any>).mockResolvedValue(undefined);
      (userService.createHashedPassword as jest.MockedFunction<any>).mockResolvedValue(mHashedPass);
      (setDataToRedis as jest.MockedFunction<any>).mockResolvedValue('sessionID', session);

      await signUp(mReq as unknown as Request, mRes as unknown as Response);

      expect(setDataToRedis).toHaveBeenCalledWith('sessionID', JSON.stringify(session));
      expect(createUser).toHaveBeenCalledWith({ login: mUser.login, password: mHashedPass });
      expect(getUserByLogin).toHaveBeenCalledWith(mUser.login);
      expect(createHashedPassword).toHaveBeenCalledWith(mUser.password);

      expect(mRes.json).toHaveBeenCalledWith({ id: mUser.id, login: mUser.login });
    });
  });

  describe.skip('sign-in', () => {
    it('login mismatch', async () => {
      const mReq = { body, sessionID: 'sessionID', session };
      let mRes: any;
      mRes = {
        send: jest.fn(),
        status: jest.fn(() => mRes),
      };

      (userService.getUserByLogin as jest.MockedFunction<any>).mockResolvedValue(undefined);

      await signIn(mReq as unknown as Request, mRes as unknown as Response);

      expect(getUserByLogin).toHaveBeenCalledWith(mUser.login);
      expect(mRes.status).toHaveBeenCalledWith(403);
      expect(mRes.send).toHaveBeenCalledWith('Login or password mismatch');
    });

    it('password mismatch', async () => {
      const mReq = { body, sessionID: 'sessionID', session };
      let mRes: any;
      mRes = {
        send: jest.fn(),
        status: jest.fn(() => mRes),
      };

      (userService.getUserByLogin as jest.MockedFunction<any>).mockResolvedValue(mUser);
      (userService.compareHashedPasswords as jest.MockedFunction<any>).mockResolvedValue(false);

      await signIn(mReq as unknown as Request, mRes as unknown as Response);

      expect(getUserByLogin).toHaveBeenCalledWith(mUser.login);
      expect(compareHashedPasswords).toHaveBeenCalledWith(mUser.password, mUser.password);
      expect(mRes.status).toHaveBeenCalledWith(403);
      expect(mRes.send).toHaveBeenCalledWith('Login or password mismatch');
    });

    it('success login', async () => {
      const mReq = { body, sessionID: 'sessionID', session };
      let mRes: any;
      mRes = {
        sendStatus: jest.fn(),
        cookie: jest.fn(),
      };

      (userService.getUserByLogin as jest.MockedFunction<any>).mockResolvedValue(mUser);
      (userService.compareHashedPasswords as jest.MockedFunction<any>).mockResolvedValue(true);
      (setDataToRedis as jest.MockedFunction<any>).mockResolvedValue('sessionID', session);

      await signIn(mReq as unknown as Request, mRes as unknown as Response);

      expect(setDataToRedis).toHaveBeenCalledWith('sessionID', JSON.stringify(session));
      expect(getUserByLogin).toHaveBeenCalledWith(mUser.login);
      expect(compareHashedPasswords).toHaveBeenCalledWith(mUser.password, mUser.password);
      expect(mRes.sendStatus).toHaveBeenCalledWith(200);
    });
  });
});
