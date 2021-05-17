import { env } from './config/index';
import 'reflect-metadata';

import express from 'express';
import bodyParser from 'body-parser';

import router from './router';
import { createConnection } from 'typeorm';

const app = express();

const port = env.APP_PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

createConnection()
    .then(async (connection) => {
        console.log('Connection to db is successful');

        app.listen(port, () => {
            return console.log(`Server is listening on ${port}`);
        });

    })
    .catch((error) => console.error(error));