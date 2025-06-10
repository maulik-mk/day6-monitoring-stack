// Backend/services/logger.js
import winston from 'winston';
import 'winston-mongodb';
import LokiTransport from 'winston-loki';

export const createLogger = (mongoUri) => {
  console.log('Initializing logger...');
  console.log('Loki Host from env:', process.env.LOKI_URL);
  console.log('Loki User from env:', process.env.LOKI_USER);
  console.log('Is LOKI_API_KEY set?', !!process.env.LOKI_API_KEY);
  console.log('Attempting to connect to Loki with config:');
  console.log('  Host:', process.env.LOKI_URL);
  console.log('  Labels:', { job: 'node-app' });

  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.MongoDB({
        db: mongoUri,
        collection: 'logs',
        tryReconnect: true,
      }),
      new LokiTransport({
        host: process.env.LOKI_URL,
        labels: { app: 'my-app' },
        json: true,
        basicAuth: `${process.env.LOKI_USER}:${process.env.LOKI_API_KEY}`,
        format: winston.format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.error(err),
      }),
    ],
  });
};