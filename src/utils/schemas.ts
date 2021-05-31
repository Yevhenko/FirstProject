import * as zod from 'zod';

export const userSchema = zod.object({
  login: zod.string(),
  password: zod.string(),
});

export const postSchema = zod.object({
  title: zod.string(),
  text: zod.string(),
});
