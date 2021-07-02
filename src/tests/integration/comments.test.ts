import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { constants } from '@constants/constants';
import { Post } from '@components/post';
import { User } from '@components/user';
import { app } from '../../index';
import { createTypeormConnection } from '../../db/createConnection';

describe('comments', () => {
  let connection: Connection;
  const testCommentData = { text: 'someText' };

  const cookieObj = {
    cookieKey: constants.COOKIES_KEY,
    cookie: 'someCookie',
  };

  const testUser = { id: 1, login: 'Yevhen', password: 'Svyrydov' };
  const testPost = { id: 1, title: 'someTitle', text: 'someText', userId: 1 };
  const testComment = { id: 1, text: 'anyText', userId: 1, postId: 1 };

  beforeAll(async () => {
    connection = await createTypeormConnection();
    await getConnection().createQueryBuilder().delete().from(Post).execute();
    await getConnection().createQueryBuilder().delete().from(User).execute();
  });

  afterAll(async () => {
    await getConnection();
    await getConnection().createQueryBuilder().delete().from(Post).execute();
    await getConnection().createQueryBuilder().delete().from(User).execute();

    await connection.close();
  });

  describe('creation of comment', () => {
    it('success creation', async () => {
      const res = await request(app)
        .post('/comments')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(testCommentData);

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();
      expect(res.body).not.toEqual(testComment);
    });

    it('create comment - no text', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(testPost.text);

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('Errors');
    });
  });

  describe('getting one comment', () => {
    it('the comment has been got', async () => {
      const res = await request(app)
        .get('/comments/1')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(testCommentData);

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();
      expect(res.body).not.toEqual(testComment);
    });
  });

  describe('updating comment', () => {
    it('the comment has been updated', async () => {
      const update = (testComment.text = 'newText');
      const res = await request(app)
        .patch('/comments/1')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(update);

      expect(res.status).toEqual(200);
      expect(res.body).not.toBeNull();
      expect(res.body).not.toEqual(testComment);
    });
  });

  describe('delete comment', () => {
    it('the comment has been deleted', async () => {
      const update = (testComment.text = 'newText');
      const res = await request(app)
        .delete('/comments/1')
        .set('Cookie', `${cookieObj.cookieKey}=${cookieObj.cookie}`)
        .send(update);

      expect(res.status).toEqual(200);
    });
  });
});
