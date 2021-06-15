import { Connection, getConnection } from 'typeorm';
import request from 'supertest';
import { app } from '../../index';
import { constants } from '../../constants/constatnts';
import { User } from '@components/user/models/User';
import { Post } from '@components/post/models/Post';
import { createTypeormConnection } from '../../db/createConnection';
import { createUser, getUserByIdFromDb } from '@components/user/services';
import { removeDataFromRedis, setDataToRedis } from '@components/auth/services';
import { createPostInDb, getUserIdOfThePost } from '@components/post/service';

describe('posts routes', () => {
  let connection: Connection;

  const cookieObj = {
    cookieKey: constants.COOKIES_KEY,
    cookie: 'someCookie',
  };

  const testUser = { login: 'Yevhen', password: 'Svyrydov' };
  const testPost = { id: 1, title: 'someTitle', text: 'someText', userId: 1 };

  beforeAll(async () => {
    connection = await createTypeormConnection();

    const user = await createUser(testUser);
    const userForPost = await getUserByIdFromDb(user.id);
    await createPostInDb({ user: userForPost, ...testPost });
    const session = {
      userId: user.id,
    };
    await setDataToRedis(cookieObj.cookie, JSON.stringify(session));
  });

  afterAll(async () => {
    await removeDataFromRedis(cookieObj.cookie);
    await getConnection().createQueryBuilder().delete().from(Post).execute();
    await getConnection().createQueryBuilder().delete().from(User).execute();

    await connection.close();
  });

  describe('create post', () => {
    it('create post - success', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(testPost);

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();
      expect(res.body).not.toEqual(testPost);
    });

    describe('get posts', () => {
      it('get many posts - success', async () => {
        const res = await request(app).get('/posts').set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);

        expect(res.status).toEqual(200);
      });
    });

    describe('get one post', () => {
      it('get one post - success', async () => {
        const res = await request(app).get('/posts/1').set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);

        expect(res.status).toEqual(200);
      });
    });

    describe('update post', () => {
      it('update one post - success', async () => {
        const updatePost = { title: 'newTitle' };
        const res = await request(app)
          .patch('/posts/1')
          .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
          .send(updatePost);

        expect(res.status).toEqual(200);
      });

      // it('failed to get credentials to update', async () => {
      //   const updatePost = { title: 'newTitle' };
      //   const res = await request(app)
      //     .patch('/posts/5')
      //     .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
      //     .send(updatePost);
      //
      //   expect(res).toThrow();
      // });
    });

    describe('delete post', () => {
      it('delete one post - success', async () => {
        const res = await request(app).patch('/posts/1').set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);

        expect(res.status).toEqual(200);
      });

      // it('failed to get credentials to delete', async () => {
      //   const res = await request(app).patch('/posts/7').set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);
      //
      //   expect(res).toThrow();
      // });
    });
  });
});
