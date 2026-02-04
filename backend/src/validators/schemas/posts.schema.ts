import { z } from 'zod';
import { objectIdSchema } from './common.schema.js';

export const createPostBodySchema = z
  .object({
    createdBy: objectIdSchema,
    title: z.string().min(1, 'title is required'),
    content: z.string().min(1, 'content is required'),
  })
  .strict();

export const updatePostBodySchema = z
  .object({
    title: z.string().min(1, 'title cannot be empty').optional(),
    content: z.string().min(1, 'content cannot be empty').optional(),
  })
  .strict()
  .refine((data) => Boolean(data.title) || Boolean(data.content), {
    message: 'provide title and/or content',
  });

export const postIdParamsSchema = z
  .object({
    id: objectIdSchema,
  })
  .strict();
