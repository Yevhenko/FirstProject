import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { removeDataFromRedis, setDataToRedis } from '@components/auth/services';
import { constants } from '@constants/constants';
import { createUser } from '@components/user/services';
import { User } from '@components/user/models/User';
import { app } from '../../index';
import { createTypeormConnection } from '../../db/createConnection';

describe.skip('users', () => {
  let connection: Connection;

  const cookieObj = {
    cookieKey: constants.COOKIES_KEY,
    cookie: 'someCookie',
  };

  const testData = { login: 'Yevhen', password: 'Svyrydov' };

  beforeAll(async () => {
    connection = await createTypeormConnection();

    const user = await createUser(testData);
    const session = {
      userId: user.id,
    };
    await setDataToRedis(cookieObj.cookie, JSON.stringify(session));
  });

  afterAll(async () => {
    await removeDataFromRedis(cookieObj.cookie);
    await getConnection().createQueryBuilder().delete().from(User).execute();

    await connection.close();
  });

  it('success case', async () => {
    const res = await request(app).get('/users').set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);

    expect(res.status).toEqual(200);
    expect(res.body).not.toBeNull();
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].id).not.toBeNull();
    expect(res.body[0].login).not.toBeNull();
  });
});
