import { z } from 'zod';
import { objectIdSchema } from './common.schema.js';

export const createUserBodySchema = z
  .object({
    email: z.string().trim().min(1, 'email is required'),
    name: z.string().trim().min(1, 'name is required'),
  })
  .strict();

export const userIdParamsSchema = z
  .object({
    id: objectIdSchema,
  })
  .strict();
