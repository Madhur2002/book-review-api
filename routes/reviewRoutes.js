// routes/reviewRoutes.js
const express = require('express');
const { addReview, editReview, removeReview } = require('../controllers/reviewController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// POST /books/:id/reviews
router.post('/books/:id/reviews', protect, addReview);

// PUT /reviews/:id
router.put('/:id', protect, editReview);

// DELETE /reviews/:id
router.delete('/:id', protect, removeReview);

module.exports = router;
