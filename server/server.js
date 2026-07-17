import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import doshaRoutes from './routes/doshaRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import herbRoutes from './routes/herbRoutes.js';
import articleRoutes from './routes/articleRoutes.js';

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
// CLIENT_URL set in Render dashboard → your Vercel frontend URL
const allowedOrigins = [
  process.env.CLIENT_URL,                  // e.g. https://your-app.vercel.app
  'http://localhost:5173',                  // Vite dev server
  'http://localhost:3000',                  // fallback
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow server-to-server calls (no origin) and listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,                        // needed if you ever send cookies
}));
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ayurveda Advisory API is running' });
});

// Bind API routes
app.use('/api/auth', authRoutes);
app.use('/api/dosha', doshaRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/herbs', herbRoutes);
app.use('/api/articles', articleRoutes);

// Page Not Found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
