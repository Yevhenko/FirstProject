import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { constants } from '@constants/constants';
import { Post } from '@components/post';
import { User } from '@components/user';
import { removeAllDataFromRedis, setDataToRedis } from '@components/auth/services';
import { createUser } from '@components/user/services';
import { app } from '../../index';
import { createTypeormConnection } from '../../db/createConnection';

describe.skip('comments', () => {
  let connection: Connection;

  const cookieObj = {
    cookieKey: constants.COOKIES_KEY,
    cookie: 'someCookie',
  };

  const testUser = { id: 1, login: 'Yevhen', password: 'Svyrydov' };
  const testPost = { id: 1, title: 'someTitle', text: 'someText', userId: 1 };
  const testComment = {
    id: 1,
    text: 'anyText',
    userId: 1,
    postId: 1,
    createdAt: 1625235619486,
    updatedAt: 1625235619486,
  };

  beforeEach(async () => {
    connection = await createTypeormConnection();
    await getConnection().createQueryBuilder().delete().from(Post).execute();
    await getConnection().createQueryBuilder().delete().from(User).execute();

    const user = await createUser(testUser);

    const session = {
      userId: user.id,
    };
    await setDataToRedis(cookieObj.cookie, JSON.stringify(session));
  });

  afterEach(async () => {
    await getConnection();
    await getConnection().createQueryBuilder().delete().from(Post).execute();
    await getConnection().createQueryBuilder().delete().from(User).execute();
    await removeAllDataFromRedis();

    await connection.close();
  });

  describe('creation of comment', () => {
    it('success creation', async () => {
      const res = await request(app)
        .post('/comments')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(testComment.text);

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();
      expect(res.body).toEqual(testComment);
    });
  });

  describe('getting one comment', () => {
    it('the comment has been got', async () => {
      const res = await request(app).get(`/comments/1`).set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();
      expect(res.body).toEqual(testComment);
    });
  });

  describe('getting all comments', () => {
    it('the comment has been got', async () => {
      const res = await request(app).get(`/comments`).set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();
      expect(res.body).toEqual([
        {
          id: 1,
          text: 'anyText',
          postId: 1,
          userId: 1,
          createdAt: 1625235619486,
          updatedAt: 1625235619486,
        },
        {
          id: 2,
          text: 'oneMoreText',
          postId: 1,
          userId: 1,
          createdAt: 1625235619486,
          updatedAt: 1625235619486,
        },
      ]);
    });
  });

  describe('updating comment', () => {
    it('the comment has been updated', async () => {
      // eslint-disable-next-line no-multi-assign
      const update = (testComment.text = 'newText');
      const res = await request(app)
        .patch('/comments/1')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(update);

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();
    });
  });

  describe('delete comment', () => {
    it('the comment has been deleted', async () => {
      // eslint-disable-next-line no-multi-assign
      const update = (testComment.text = 'newText');
      const res = await request(app)
        .delete('/comments/1')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(update);

      expect(res.status).toEqual(200);
    });
  });
});
