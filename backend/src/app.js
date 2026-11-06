import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

export const createApp = () => {
  const app = express();

  // Global Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || true,
      credentials: true,
    })
  );
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(cookieParser());

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount API Endpoints
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/availability', availabilityRoutes);
  app.use('/api/v1/bookings', bookingRoutes);

  // Global Central Error Handler
  app.use((err, req, res, next) => {
    console.error(`[Error] ${err.stack || err.message}`);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });

  return app;
};
