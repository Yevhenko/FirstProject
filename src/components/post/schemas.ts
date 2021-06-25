import * as zod from 'zod';

export const createPostSchema = {
  body: zod.object({
    title: zod.string(),
    text: zod.string(),
  }),
};

export const updatePostSchema = {
  body: zod.object({
    title: zod.string().optional(),
    text: zod.string().optional(),
  }),
  params: zod.object({
    id: zod.string().max(6),
  }),
};
