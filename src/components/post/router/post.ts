import express from 'express';

export const post = express.Router();

post.post('/post/:id');
post.get('/post');
