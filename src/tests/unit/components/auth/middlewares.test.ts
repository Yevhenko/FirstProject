import { NextFunction, Request, Response } from 'express';
import { auth } from '@components/auth/middlewares';
import { constants } from '@constants/constants';
import { getDataFromRedis } from '@components/auth/services';
import { userService } from '@components/user';

jest.mock('@components/user/services', () => {
  return {
    getUserByIdFromDb: jest.fn(),
  };
});

jest.mock('@components/auth/services', () => {
  return {
    getDataFromRedis: jest.fn(),
  };
});

describe.skip('auth middleware', () => {
  let mReq: Partial<Request>;
  let mRes: any;
  let nextFunction: NextFunction = jest.fn();

  const cookies = {
    'connect.sid': 'anyCookie',
  };

  const mData = {
    userId: 1,
    user: { id: 1 },
  };

  beforeEach(() => {
    mReq = {};
    mRes = {
      json: jest.fn(),
      status: jest.fn(() => mRes),
    };
  });

  it('without sessionId', async () => {
    mReq = {
      cookies: 'incorrectCookieKey',
    };
    await auth(mReq as Request, mRes as Response, nextFunction);

    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toBeCalledWith('no proper cookie');
  });

  it('no data about session in Redis', async () => {
    mReq = {
      cookies: cookies,
    };
    (getDataFromRedis as jest.MockedFunction<any>).mockResolvedValue(null);

    await auth(mReq as Request, mRes as Response, nextFunction);

    expect(getDataFromRedis).toHaveBeenCalledWith('anyCookie');
    expect(mRes.status).toHaveBeenCalledWith(401);
    expect(mRes.json).toBeCalledWith('invalid sign-in');
  });

  it('data exists in Redis, but user niot found in DB', async () => {
    mReq = {
      cookies: cookies,
    };
    (getDataFromRedis as jest.MockedFunction<any>).mockResolvedValue(JSON.stringify(mData));
    (userService.getUserByIdFromDb as jest.MockedFunction<any>).mockResolvedValue(undefined);

    await auth(mReq as Request, mRes as Response, nextFunction);

    expect(getDataFromRedis).toHaveBeenCalledWith('anyCookie');
    expect(userService.getUserByIdFromDb).toHaveBeenCalledWith(mData.userId);
    expect(mRes.status).toHaveBeenCalledWith(500);
    expect(mRes.json).toBeCalledWith('user not found');
  });

  it('calling NextFunction', async () => {
    mReq = {
      cookies: cookies,
    };

    (getDataFromRedis as jest.MockedFunction<any>).mockResolvedValue(JSON.stringify(mData));
    (userService.getUserByIdFromDb as jest.MockedFunction<any>).mockResolvedValue(mData.user);

    await auth(mReq as Request, mRes as Response, nextFunction);

    expect(getDataFromRedis).toHaveBeenCalledWith('anyCookie');
    expect(userService.getUserByIdFromDb).toHaveBeenCalledWith(mData.userId);

    expect(nextFunction).toBeCalledTimes(1);
  });
});
