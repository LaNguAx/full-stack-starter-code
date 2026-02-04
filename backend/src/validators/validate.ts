import type { NextFunction, Request, Response } from 'express';
import type { core, ZodType } from 'zod';

type AnyZodSchema = ZodType<any, any, any>;

type ValidationTargets = {
  body?: AnyZodSchema;
  params?: AnyZodSchema;
  query?: AnyZodSchema;
};

type ValidationErrorItem = {
  path: string;
  message: string;
};

function formatIssues(issues: core.$ZodIssue[], prefix: string): ValidationErrorItem[] {
  return issues.map((issue) => {
    const path = issue.path.length > 0 ? `${prefix}.${issue.path.join('.')}` : prefix;
    return { path, message: issue.message };
  });
}

export function validate(targets: ValidationTargets) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: ValidationErrorItem[] = [];

    if (targets.body) {
      const result = targets.body.safeParse(req.body);
      if (!result.success) {
        errors.push(...formatIssues(result.error.issues, 'body'));
      } else {
        req.body = result.data;
      }
    }

    if (targets.params) {
      const result = targets.params.safeParse(req.params);
      if (!result.success) {
        errors.push(...formatIssues(result.error.issues, 'params'));
      } else {
        req.params = result.data;
      }
    }

    if (targets.query) {
      const result = targets.query.safeParse(req.query);
      if (!result.success) {
        errors.push(...formatIssues(result.error.issues, 'query'));
      } else {
        req.query = result.data;
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'validation error', errors });
    }

    return next();
  };
}
