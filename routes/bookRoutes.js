const express = require('express');
const {
  addBook,
  listBooks,
  getBookDetails, 
  submitReview,
  searchBooks
} = require('../controllers/bookController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// GET /search
router.get('/search', searchBooks);

// GET /books – list with filters/pagination
router.get('/', listBooks);

// GET /books/:id – details + avg rating + paginated reviews
router.get('/:id', getBookDetails);

// POST /books – protected
router.post('/', protect, addBook);

//POST /books/:id/reviews
router.post('/:id/reviews', protect, submitReview);


module.exports = router;
