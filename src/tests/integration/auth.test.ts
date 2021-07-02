import request from 'supertest';
import { Connection, getConnection, Migration } from 'typeorm';
import { removeAllDataFromRedis, setDataToRedis } from '@components/auth/services';
import { User } from '@components/user';
import { app } from '../../index';
import { createTypeormConnection } from '../../db/createConnection';
import { constants } from '@constants/constants';
import { createUser, getUserByIdFromDb } from '@components/user/services';
import { createPostInDb } from '@components/post/service';
import { Post } from '@components/post';

describe.skip('integration tests', () => {
  let connection: Connection;
  const testData = { login: 'Yevhen', password: 'password' };

  const cookieObj = {
    cookieKey: constants.COOKIES_KEY,
    cookie: 'someCookie',
  };

  const testUser = { login: 'Yevhen', password: 'Svyrydov' };
  const testPost = { id: 1, title: 'someTitle', text: 'someText', userId: 1 };

  beforeAll(async () => {
    connection = await createTypeormConnection();
  });

  afterAll(async () => {
    await removeAllDataFromRedis();
    await getConnection().createQueryBuilder().delete().from(Post).execute();
    await getConnection().createQueryBuilder().delete().from(User).execute();

    await connection.close();
  });

  describe('auth/sign-up', () => {
    afterEach(async () => {
      await getConnection().createQueryBuilder().delete().from(Post).execute();
      await removeAllDataFromRedis();
      await getConnection().createQueryBuilder().delete().from(User).execute();
    });
    it('success case', async () => {
      const res = await request(app).post('/auth/sign-up').send(testData);

      expect(res.status).toEqual(200);
      expect(res.headers.cookie).not.toBeNull();
      expect(res.body).not.toBeNull();
    });

    it('without login', (done) => {
      request(app)
        .post('/auth/sign-up')
        .send(testData.password)
        .then((res) => {
          expect(res.body).toHaveProperty('Errors');

          done();
        });
    });
  });

  describe('auth/sign-in', () => {
    afterEach(async () => {
      await removeAllDataFromRedis();
      await getConnection().createQueryBuilder().delete().from(Post).execute();
      await getConnection().createQueryBuilder().delete().from(User).execute();
    });
    it('success case', (done) => {
      request(app).post('/auth/sign-in').send(testData).expect(200, testData);

      done();
    });
  });

  describe('users', () => {
    beforeEach(async () => {
      const user = await createUser(testData);
      const session = {
        userId: user.id,
      };
      await setDataToRedis(cookieObj.cookie, JSON.stringify(session));
    });

    afterEach(async () => {
      await removeAllDataFromRedis();
      await getConnection().createQueryBuilder().delete().from(Post).execute();
      await getConnection().createQueryBuilder().delete().from(User).execute();
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

  describe('create post', () => {
    beforeAll(async () => {
      const user = await createUser(testData);
      const userForPost = await getUserByIdFromDb(user.id);
      await createPostInDb({ user: userForPost, ...testPost });
      const session = {
        userId: user.id,
      };
      await setDataToRedis(cookieObj.cookie, JSON.stringify(session));
    });

    afterAll(async () => {
      await removeAllDataFromRedis();
      await getConnection().createQueryBuilder().delete().from(Post).execute();
      await getConnection().createQueryBuilder().delete().from(User).execute();
    });

    it('create post - success', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(testPost);

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();
      expect(res.body).toEqual({ id: 2, title: 'someTitle', text: 'someText', userId: 3 });
    });

    it('create post - no title', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(testPost.text);

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('Errors');
    });
  });

  describe('get posts', () => {
    beforeEach(async () => {
      const user = await createUser(testUser);

      const userForPost = await getUserByIdFromDb(user.id);
      await createPostInDb({ user: userForPost, ...testPost });
      const session = {
        userId: user.id,
      };
      await setDataToRedis(cookieObj.cookie, JSON.stringify(session));
    });

    afterEach(async () => {
      await removeAllDataFromRedis();
      await getConnection().createQueryBuilder().delete().from(Post).execute();
      await getConnection().createQueryBuilder().delete().from(User).execute();
    });

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

  describe('get one post', () => {
    beforeEach(async () => {
      const user = await createUser(testUser);
      const userForPost = await getUserByIdFromDb(user.id);
      await createPostInDb({ user: userForPost, ...testPost });
      const session = {
        userId: user.id,
      };
      await setDataToRedis(cookieObj.cookie, JSON.stringify(session));
    });

    afterEach(async () => {
      await removeAllDataFromRedis();
      await getConnection().createQueryBuilder().delete().from(Post).execute();
      await getConnection().createQueryBuilder().delete().from(User).execute();

      await connection.close();
    });

    it('get one post - success', async () => {
      const res = await request(app).get('/posts/1').set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);

      expect(res.status).toEqual(200);
    });
  });

  describe('update post', () => {
    beforeAll(async () => {
      await createTypeormConnection();

      await getConnection().createQueryBuilder().delete().from(Post).execute();
      await getConnection().createQueryBuilder().delete().from(User).execute();
      const user = await createUser(testUser);
      const userForPost = await getUserByIdFromDb(user.id);
      await createPostInDb({ user: userForPost, ...testPost });
      const session = {
        userId: user.id,
      };
      await setDataToRedis(cookieObj.cookie, JSON.stringify(session));
    });

    it('update one post - success', async () => {
      const updatePost = (testPost.title = 'newTitle');
      const res = await request(app)
        .patch('/posts/1')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(updatePost);

      expect(res.status).toEqual(200);
    });
  });

  describe('delete post', () => {
    beforeAll(async () => {
      await removeAllDataFromRedis();
      const user = await createUser(testUser);
      const userForPost = await getUserByIdFromDb(user.id);
      await createPostInDb({ user: userForPost, ...testPost });
      const session = {
        userId: user.id,
      };
      await setDataToRedis(cookieObj.cookie, JSON.stringify(session));
    });

    afterAll(async () => {
      await removeAllDataFromRedis();
      await getConnection().createQueryBuilder().delete().from(Post).execute();
      await getConnection().createQueryBuilder().delete().from(User).execute();
    });

    it('delete one post - success', async () => {
      const res = await request(app).delete('/posts/1').set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`);

      expect(res.status).toEqual(200);
    });
  });
});
