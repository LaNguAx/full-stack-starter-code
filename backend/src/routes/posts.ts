import { Router } from 'express';
import mongoose from 'mongoose';
import { PostModel } from '../models/Post.js';
import { UserModel } from '../models/User.js';

export const postsRouter = Router();

// CREATE post + link into user.posts
postsRouter.post('/', async (req, res) => {
  try {
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

    const user = await UserModel.findById(createdBy);
    if (!user) return res.status(404).json({ message: 'user not found' });

    const post = await PostModel.create({ createdBy: user._id, title, content });

    // keep user.posts updated
    user.posts.push(post._id);
    await user.save();

    return res.status(201).json(post);
  } catch {
    return res.status(500).json({ message: 'server error' });
  }
});

// READ all posts (with createdBy populated)
postsRouter.get('/', async (_req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'email name'); // only return those fields

    return res.json(posts);
  } catch {
    return res.status(500).json({ message: 'server error' });
  }
});

// READ one
postsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'invalid id' });

    const post = await PostModel.findById(id).populate('createdBy', 'email name');
    if (!post) return res.status(404).json({ message: 'post not found' });

    return res.json(post);
  } catch {
    return res.status(500).json({ message: 'server error' });
  }
});

// UPDATE (title/content)
postsRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'invalid id' });

    const { title, content } = req.body as { title?: string; content?: string };
    if (!title && !content) {
      return res.status(400).json({ message: 'provide title and/or content' });
    }

    const updated = await PostModel.findByIdAndUpdate(
      id,
      { $set: { ...(title ? { title } : {}), ...(content ? { content } : {}) } },
      { new: true },
    );

    if (!updated) return res.status(404).json({ message: 'post not found' });
    return res.json(updated);
  } catch {
    return res.status(500).json({ message: 'server error' });
  }
});

// DELETE post + remove from user.posts
postsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'invalid id' });

    const post = await PostModel.findById(id);
    if (!post) return res.status(404).json({ message: 'post not found' });

    await PostModel.deleteOne({ _id: post._id });

    await UserModel.updateOne({ _id: post.createdBy }, { $pull: { posts: post._id } });

    return res.status(204).send();
  } catch {
    return res.status(500).json({ message: 'server error' });
  }
});
