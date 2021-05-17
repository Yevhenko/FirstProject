import {env} from './config/index';
import 'reflect-metadata';

import express from 'express';
import bodyParser from 'body-parser';

import { createConnection } from 'typeorm';
import router from './router';

const app = express();

const port = env.APP_PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

createConnection()
  .then(async () => {
    console.log('Connection to db is successful');

    app.listen(port, () => {
      return console.log(`Server is listening on ${port}`);
    });
  })
  .catch((error) => console.error(error));
