require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

// Inicializar base datos (crea las tablas si no existen)
require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'To-Do API is running' });
});

// 404 handler (uniform response)
app.use((req, res) => {
  res.status(404).json({ error: true, code: 'NOT_FOUND', message: 'Route not found' });
});

// Centralized error handler
const handlingError = require('./src/middlewares/handlingError');
app.use(handlingError);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
