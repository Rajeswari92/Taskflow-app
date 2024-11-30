const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes'); 
require('dotenv').config();
const app = express();

// Middleware
app.use(
    cors({
      origin: ['https://taskflow-frontend-qhu7.onrender.com', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
      credentials: true, // Allow cookies if needed
    })
  );
  
app.use(express.json()); // For parsing JSON requests

// Routes
app.use('/api', taskRoutes); // Prefix the routes with '/api'

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB successfully'))
.catch((err) => console.error('Failed to connect to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on http://localhost:5000'));