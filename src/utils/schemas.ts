import * as zod from 'zod';

export const userBodySchema = zod.object({
  login: zod.string(),
  password: zod.string(),
});

export const postBodySchema = zod.object({
  title: zod.string(),
  text: zod.string(),
});

export const querySchema = zod.object({
  offset: zod.string().max(6),
  limit: zod.string().max(6),
});

export const paramsSchema = zod.object({
  id: zod.string().max(6),
});
