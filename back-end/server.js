import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import storageRoutes from './routes/storageRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, '..', 'front-end', 'source');

app.use(express.static(frontendPath));
app.use(express.json({ limit: '10mb' }));

app.use('/v1',       taskRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/storage', storageRoutes);

app.use(errorHandler);

app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

(async () => {
  await sequelize.sync();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
