import * as zod from 'zod';

export const createUserSchema = {
  body: zod.object({
    login: zod.string(),
    password: zod.string(),
  }),
};

export const createPostSchema = {
  body: zod.object({
    title: zod.string(),
    text: zod.string(),
  }),
};

export const updatePostSchema = {
  body: zod.object({
    title: zod.string(),
    text: zod.string(),
  }),
  params: zod.object({
    id: zod.string().max(6),
  }),
};

export const getQuerySchema = {
  query: zod.object({
    offset: zod.string().max(6).default('0'),
    limit: zod.string().max(6).default('10'),
  }),
};

export const paramsSchema = {
  params: zod.object({
    id: zod.string().max(6),
  }),
};
