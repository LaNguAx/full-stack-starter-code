import { validate } from './validate.js';
import { createUserBodySchema, userIdParamsSchema } from './schemas/users.schema.js';

export const validateUserId = validate({ params: userIdParamsSchema });
export const validateCreateUser = validate({ body: createUserBodySchema });
