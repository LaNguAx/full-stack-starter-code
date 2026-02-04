import { validate } from './validate.js';
import {
  createPostBodySchema,
  postIdParamsSchema,
  updatePostBodySchema,
} from './schemas/posts.schema.js';

export const validateCreatePost = validate({ body: createPostBodySchema });
export const validatePostId = validate({ params: postIdParamsSchema });
export const validateUpdatePost = validate({ body: updatePostBodySchema });
