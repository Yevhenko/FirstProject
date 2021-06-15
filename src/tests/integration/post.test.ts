import { Connection, getConnection } from 'typeorm';
import request from 'supertest';
import { constants } from '@constants/constants';
import { User } from '@components/user/models/User';
import { Post } from '@components/post/models/Post';
import { createUser, getUserByIdFromDb } from '@components/user/services';
import { removeDataFromRedis, setDataToRedis } from '@components/auth/services';
import { createPostInDb } from '@components/post/service';
import { createTypeormConnection } from '../../db/createConnection';
import { app } from '../../index';

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

  describe.skip('create post', () => {
    it('create post - success', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(testPost);

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();
      expect(res.body).not.toEqual(testPost);
    });

    it('create post - no title', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(testPost.text);

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('Errors');
    });

    it('create post - no text', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(testPost.title);

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('Errors');
    });
  });

  describe.skip('get posts', () => {
    it('get many posts - success', async () => {
      const res = await request(app).get('/posts').set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0].id).not.toBeNull();
      expect(res.body[0].title).not.toBeNull();
      expect(res.body[0].text).not.toBeNull();
    });
  });

  describe.skip('get one post', () => {
    it('get one post - success', async () => {
      const res = await request(app).get('/posts/1').set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);

      expect(res.status).toEqual(200);
    });
  });

  describe.skip('update post', () => {
    it('update one post - success', async () => {
      const updatePost = (testPost.title = 'newTitle');
      const res = await request(app)
        .patch('/posts/1')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(updatePost);

      expect(res.status).toEqual(200);
    });
  });

  describe.skip('delete post', () => {
    it('delete one post - success', async () => {
      const res = await request(app).delete('/posts/1').set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);

      expect(res.status).toEqual(200);
    });
  });
});
