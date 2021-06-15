import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../index';
import { createTypeormConnection } from '../../db/createConnection';

describe.skip('auth routes', () => {
  let connection: Connection;
  const testData = { login: 'Yevhen', password: 'password' };

  beforeAll(async () => {
    connection = await createTypeormConnection();
  });

  afterAll(async () => await connection.close());

  describe('auth/sign-up', () => {
    it('success case', async () => {
      const res = await request(app).post('/auth/sign-up').send(testData);

      expect(res.status).toEqual(200);
      expect(res.headers.cookie).not.toBeNull();
    });

    it('without login', (done) => {
      request(app)
        .post('/auth/sign-up')
        .send(testData.password)
        .expect(400)
        .then((res) => {
          expect(res.text).toEqual('Bad request');

          done();
        });
    });
  });

  describe('auth/sign-in', () => {
    it('success case', (done) => {
      request(app).post('/auth/sign-in').send(testData).expect(200, testData);

      done();
    });
  });

  it('without password', (done) => {
    request(app)
      .post('/auth/sign-up')
      .send(testData.login)
      .expect(400)
      .then((res) => {
        expect(res.text).toEqual('Bad request');

        done();
      });
  });
});
