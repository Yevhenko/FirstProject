import 'reflect-metadata';
import express, { Request } from 'express';
import session from 'express-session';
import cookieParser = require('cookie-parser');
import connectRedis from 'connect-redis';
import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import { env, redisClient } from '@config/config';
import { router } from './router';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

const app = express();
const port = env.APP_PORT;

const RedisStore = connectRedis(session);
redisClient.on('error', function (err: Error) {
  console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err: Error) {
  console.log('Connected to redis successfully');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60000 },
  }),
);
app.use(router);

createConnection()
  .then(async () => {
    console.log('Connection to db is successful');

    app.listen(port, () => {
      return console.log(`Server is listening on ${port}`);
    });
  })
  .catch((error) => console.error(error));
