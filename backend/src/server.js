import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  await connectDB();

  const app = createApp();
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
