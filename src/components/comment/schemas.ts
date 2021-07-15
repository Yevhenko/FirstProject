import * as zod from 'zod';

export const createCommentSchema = {
  body: zod.object({
    postId: zod.number(),
    text: zod.string(),
  }),
};

export const updateCommentSchema = {
  body: zod.object({
    text: zod.string().optional(),
  }),
  params: zod.object({
    id: zod.string().max(6),
  }),
};
