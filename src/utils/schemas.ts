import * as zod from 'zod';

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
