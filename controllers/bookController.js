const {
  createBook,
  getBooks,
  countBooks,
  getBookById,         
  searchBooks: repoSearchBooks
} = require('../repositories/bookRepository');

const {
  findReviewById,
  updateReview: repoUpdateReview,
  deleteReview: repoDeleteReview,
  findReviewByUserAndBook,
  createReview,
  getReviewsByBook,
  countReviewsByBook  
} = require('../repositories/reviewRepository');

// POST /books (protected)
const addBook = async (req, res) => {
  const { title, author, genre, published } = req.body;
  if (!title || !author || !genre) {
    return res.status(400).json({ message: 'Title, author, and genre are required' });
  }

  try {
    const book = await createBook({
      title,
      author,
      genre,
      published,
      createdBy: req.user.userId,
    });
    res.status(201).json({ message: 'Book added', book });
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ message: 'Failed to add book', error: err.message });
  }
};


 /**
  * GET /books
  * - page & limit default to 1 & 10
  * - optional ?author=…&genre=…
  */
const listBooks = async (req, res) => {
  try {
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { author, genre } = req.query;

    const books = await getBooks({ author, genre, page, limit });
    const total = await countBooks({ author, genre });

    res.json({
      page,
      limit,
      total,
      books
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};


 /**
  * Get /books/:id
  * avg rating and reviews
  */
const getBookDetails = async (req, res) => {
  try {
    const bookId = req.params.id;
    const page  = parseInt(req.query.page, 10)  || 1;
    const limit = parseInt(req.query.limit, 10) || 5;

    const book = await getBookById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const [reviews, totalReviews] = await Promise.all([
      getReviewsByBook({ bookId, page, limit }),
      countReviewsByBook(bookId)
    ]);

    //Compute average rating from the fetched reviews
    let averageRating = 0;
    if (totalReviews > 0) {
      const sumRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      averageRating = parseFloat((sumRating / totalReviews).toFixed(1));
    }

    return res.json({
      book,
      averageRating,
      reviews: {
        page,
        limit,
        total: totalReviews,
        data: reviews
      }
    });
  } catch (err) {
    console.error('Error fetching book details:', err);
    res.status(500).json({ message: 'Failed to fetch book details' });
  }
};



 /**
  * POST /books/:id/reviews
  */
const submitReview = async (req, res) => {
  const userId = req.user.userId;       // from auth middleware
  const bookId = req.params.id;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating is required and must be between 1 and 5' });
  }

  try {
    const existingReview = await findReviewByUserAndBook(userId, bookId);
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = await createReview({
      rating,
      comment,
      user: userId,
      book: bookId,
    });

    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};


 /**
  * PUT /reviews/:id
  * Update your own review
  */
const updateReview = async (req, res) => {
  const userId   = req.user.userId;        // from authMiddleware
  const reviewId = req.params.id;
  const { rating, comment } = req.body;

  // Validate rating if provided
  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return res
      .status(400)
      .json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const existing = await findReviewById(reviewId);
    if (!existing) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (existing.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    // Perform update
    const updated = await repoUpdateReview(reviewId, { rating, comment });
    res.json({ message: 'Review updated', review: updated });
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ message: 'Failed to update review' });
  }
};


 /**
  * DELETE /reviews/:id
  * Delete your own review
  */
 const deleteReview = async (req, res) => {
   const userId   = req.user.userId;       // from authMiddleware
   const reviewId = req.params.id;

   try {
     const existing = await findReviewById(reviewId);
     if (!existing) {
       return res.status(404).json({ message: 'Review not found' });
     }
     if (existing.user.toString() !== userId) {
       return res.status(403).json({ message: 'Not authorized to delete this review' });
     }

     await repoDeleteReview(reviewId);
     res.json({ message: 'Review deleted' });
   } catch (err) {
     console.error('Error deleting review:', err);
     res.status(500).json({ message: 'Failed to delete review' });
   }
 };

 const searchBooks = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const results = await repoSearchBooks(query);
    res.json({ results });
  } catch (err) {
    console.error('Error searching books:', err);
    res.status(500).json({ message: 'Failed to search books' });
  }
};


module.exports = {
  addBook,
  listBooks,
  getBookDetails, 
  submitReview,
  updateReview,
  deleteReview,
  searchBooks,
};
