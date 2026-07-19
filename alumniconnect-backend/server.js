require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const eventRoutes = require('./routes/eventRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

connectDB();

const app = express();

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// Dynamic CORS allowing localhost (any port) and production origins seamlessly
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins dynamically (reflects incoming origin header for localhost & production)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AlumniConnect API is running' });
});

// Mounted routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/mentorships', mentorshipRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
