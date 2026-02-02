import express from 'express';
import 'dotenv/config';
import { connectToMongoDB, startServer } from './utils.js';
import { usersRouter } from './routes/users.js';
import { postsRouter } from './routes/posts.js';
import cors from 'cors';
// create a new express application
const app = express();

// express.json() is a middleware that parses the request body and makes it available in req.body
app.use(express.json());
// express.urlencoded() is a middleware that parses the request body and makes it available in req.body
// extended: true means that the parser will support nested objects and arrays
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// create a new route that returns a JSON object with a key of ok and a value of true
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// initialize routers
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

// get the port and uri from the environment variables
const port = Number(process.env.PORT) || 3000;
const uri = process.env.MONGODB_URI;

// main function to start the server
async function main() {
  if (!uri) throw new Error('MONGODB_URI is not set');

  await connectToMongoDB(uri);

  const server = await startServer(app, port);
  console.log(`✅ Server is running on port ${port}! 🚀`);
}

// catch any errors and exit the process
main().catch((error) => {
  console.error(`❌ Failed to start: ${error}`);
  process.exit(1);
});
