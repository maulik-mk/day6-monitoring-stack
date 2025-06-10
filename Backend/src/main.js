// Backend/src/main.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from '../services/logger.js';
import logRoutes from '../routes/logRoutes.js';
import client from 'prom-client';

dotenv.config();
const app = express();

const logger = createLogger(process.env.MONGO_URI);
app.locals.logger = logger;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
});
app.use((req, res, next) => {
  httpRequestCounter.inc();
  next();
});

app.use(cors());
app.use('/logs', logRoutes);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

export { app, logger };