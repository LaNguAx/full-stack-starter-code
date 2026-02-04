import type { infer as ZodInfer } from 'zod';
import type {
  createUserBodySchema,
  userIdParamsSchema,
} from '../validators/schemas/users.schema.js';

export type CreateUserBody = ZodInfer<typeof createUserBodySchema>;
export type UserIdParams = ZodInfer<typeof userIdParamsSchema>;
