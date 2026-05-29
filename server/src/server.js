import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

export const createServer = () => {
  const app = express();

  app.use(helmet());
  
  const allowedOrigins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:5174'];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isAllowed = allowedOrigins.includes(origin) || origin.startsWith('http://localhost:');
        if (isAllowed) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    })
  );
  
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(rateLimit({ windowMs: 60_000, max: 160 }));

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true, service: 'PrintCRM API' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/team', teamRoutes);
  app.use('/api/uploads', uploadRoutes);
  app.use('/api/integrations', integrationRoutes);
  app.use('/webhook', webhookRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
