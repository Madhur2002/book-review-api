// index.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const { updateReview } = require('./controllers/bookController');
const { deleteReview } = require('./controllers/bookController');
const protect = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

// Middleware
app.use(express.json());

// Public auth endpoints
app.use('/auth', authRoutes);

// Protected book endpoint
app.use('/books', bookRoutes);


app.put('/reviews/:id', protect, updateReview);


app.delete('/reviews/:id', protect, deleteReview);


// Health-check
app.get('/', (req, res) => res.send('API is running'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
