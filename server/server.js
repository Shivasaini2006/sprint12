import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import postRouter from './routes/postRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import { ApiError } from './middlewares/errorHandler.js';

// Load environment configurations
dotenv.config();

// Establish connection to MongoDB
connectDB();

const app = express();

// Set port number
const PORT = process.env.PORT || 5000;

// Production-ready CORS Configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const corsOptions = {
  origin: (origin, callback) => {
    // Exclude standard API clients like Postman/Insomnia by checking if origin exists
    if (!origin || origin === clientUrl || origin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      console.warn(`WARNING: Blocked origin by CORS policy: ${origin}`);
      callback(new ApiError(403, 'Blocked by CORS Policy'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Expose standard parsers for application/json and application/x-www-form-urlencoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to PostSphere API. Use /api/posts for CRUD operations.'
  });
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy and running.',
    timestamp: new Date()
  });
});

// Expose Post Routing endpoints
app.use('/api/posts', postRouter);

// Fallback Route for non-existent endpoints (404)
app.all('*', (req, res, next) => {
  next(new ApiError(404, `Cannot find ${req.originalUrl} on this server.`));
});

// Centralized error handling middleware (Global Exception Boundary)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server executing in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled Promise rejections to keep app running without crashing
process.on('unhandledRejection', (err) => {
  console.error('CRITICAL: Unhandled Rejection 🔴. Details:', err.message);
  // Do not crash, log the warning, keep server alive as requested.
});

export default app;
