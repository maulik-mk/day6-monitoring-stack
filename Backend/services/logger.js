import winston from 'winston';
import 'winston-mongodb';
import LokiTransport from 'winston-loki';

export const createLogger = (mongoUri) => {
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
        basicAuth: `${process.env.LOKI_USER}:${process.env.LOKI_API_KEY}`,
        labels: { job: 'node-app' },
        json: true,
      }),
    ],
  });
};
