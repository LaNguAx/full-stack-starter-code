import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

export function validateCreatePost(req: Request, res: Response, next: NextFunction) {
  const { createdBy, title, content } = req.body as {
    createdBy?: string;
    title?: string;
    content?: string;
  };

  if (!createdBy || !title || !content) {
    return res.status(400).json({ message: 'createdBy, title, content are required' });
  }
  if (!mongoose.isValidObjectId(createdBy)) {
    return res.status(400).json({ message: 'createdBy is not a valid ObjectId' });
  }

  return next();
}

export function validatePostId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'invalid id' });
  return next();
}

export function validateUpdatePost(req: Request, res: Response, next: NextFunction) {
  const { title, content } = req.body as { title?: string; content?: string };
  if (!title && !content) {
    return res.status(400).json({ message: 'provide title and/or content' });
  }

  return next();
}
