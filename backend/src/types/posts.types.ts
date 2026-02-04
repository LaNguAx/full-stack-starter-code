import type { infer as ZodInfer } from 'zod';
import type {
  createPostBodySchema,
  postIdParamsSchema,
  updatePostBodySchema,
} from '../validators/schemas/posts.schema.js';

export type CreatePostBody = ZodInfer<typeof createPostBodySchema>;
export type UpdatePostBody = ZodInfer<typeof updatePostBodySchema>;
export type PostIdParams = ZodInfer<typeof postIdParamsSchema>;
