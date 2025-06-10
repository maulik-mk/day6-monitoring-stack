import express from 'express';
import { rootHandler, getLogs } from '../controllers/logController.js';

const router = express.Router();

router.get('/', rootHandler);
router.get('/all', getLogs);

router.get('/test', (req, res) => {
  req.app.locals.logger.info('Log from /logs/test on Render server!');
  res.send('Log sent to MongoDB + Grafana Loki');
  logger.info('Test route hit!');
  res.send('Log sent!');
});

export default router;
