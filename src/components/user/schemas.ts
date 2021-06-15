import * as zod from 'zod';

export const createUserSchema = {
  body: zod.object({
    login: zod.string(),
    password: zod.string(),
  }),
};
