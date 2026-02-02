import { Router } from 'express';
import mongoose from 'mongoose';
import { UserModel } from '../models/User.js';

export const usersRouter = Router();

usersRouter.get('/', async (_req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json(users);
  } catch (_err) {
    return res.status(500).json({ message: 'server error' });
  }
});

usersRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'invalid user id' });
    }

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    return res.status(200).json(user);
  } catch (_err) {
    return res.status(500).json({ message: 'server error' });
  }
});

usersRouter.post('/', async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: 'body is required' });

    const { email, name } = req.body as { email?: string; name?: string };

    if (!email || !name) {
      return res.status(400).json({ message: 'email and name are required' });
    }
    if (typeof email !== 'string' || typeof name !== 'string') {
      return res.status(400).json({ message: 'email and name must be strings' });
    }
    if (!email.trim() || !name.trim()) {
      return res.status(400).json({ message: 'email and name cannot be empty' });
    }

    const created = await UserModel.create({ email, name, posts: [] });
    return res.status(201).json(created);
  } catch (err: any) {
    // duplicate email
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'email already exists' });
    }
    console.log(err);
    return res.status(500).json({ message: 'server error' });
  }
});
