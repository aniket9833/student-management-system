import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import studentRoutes from './routes/studentRoutes.js';
import marksRoutes, { subjectRouter } from './routes/marksRoutes.js';
import { notFound, globalError } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'API is running', timestamp: new Date() }),
);

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/subjects', subjectRouter);

// 404 & Error handlers
app.use(notFound);
app.use(globalError);

export default app;
