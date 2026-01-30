 import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import helmet from 'helmet';

// Import routes
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dietPlanRoutes from './routes/dietPlanRoutes.js';

// Import controllers
import { getUserCalories, updateUserCalories } from './controllers/dietPlanController.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();
const app = express();

// Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(helmet());
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug Middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // <-- Ensure frontend calls `/api/auth/login`
app.use('/api/appointments', appointmentRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/diet-plans', dietPlanRoutes);

// Diet Plan Routes
app.get('/api/diet-plan', protect, getUserCalories);
app.post('/api/diet-plan', protect, updateUserCalories);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File size is too large. Max size is 5MB.' });
  }
  res.status(500).json({ success: false, message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});