// controllers/reviewController.js
const {
  createReview,
  findReviewByUserAndBook,
  updateReview,
  deleteReview,
} = require('../repositories/reviewRepository');


/**
 * POST /books/:id/reviews
 * Add a new review for a book by the logged-in user
 */
const addReview = async (req, res) => {
  const userId = req.user.userId;
  const bookId = req.params.id;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating between 1 and 5 required' });
  }

  if (await findReviewByUserAndBook(userId, bookId)) {
    return res.status(409).json({ message: 'You already reviewed this book' });
  }

  const review = await createReview({ book: bookId, user: userId, rating, comment });
  res.status(201).json({ message: 'Review added', review });
};


/**
 * PUT /reviews/:id
 * Edit a review created by the user
 */
const editReview = async (req, res) => {
  const userId   = req.user.userId;
  const reviewId = req.params.id;
  const { rating, comment } = req.body;

  const existing = await updateReview(reviewId, {});
  if (!existing || existing.user.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized to edit' });
  }

  const updated = await updateReview(reviewId, { rating, comment });
  res.json({ message: 'Review updated', review: updated });
};


/**
 * DELETE /reviews/:id
 * Delete a review created by the user
 */
const removeReview = async (req, res) => {
  const userId   = req.user.userId;
  const reviewId = req.params.id;

  const existing = await updateReview(reviewId, {});
  if (!existing || existing.user.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized to delete' });
  }

  await deleteReview(reviewId);
  res.json({ message: 'Review deleted' });
};

module.exports = {
  addReview,
  editReview,
  removeReview,
};
