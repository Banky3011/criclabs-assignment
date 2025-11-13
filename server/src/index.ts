import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseService } from './services/database';
import authRoutes from './routes/auth';
import dataMappingRoutes from './routes/dataMapping';
import { authenticateToken, AuthRequest } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const dbService = new DatabaseService();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data-mappings', dataMappingRoutes);

app.get('/api/profile', authenticateToken, (req: AuthRequest, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Database initialized`);
});

export default app;