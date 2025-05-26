const Review = require('../models/Review');

/**
 * Average rating for a book
 */
const getAverageRating = async (bookId) => {
  const result = await Review.aggregate([
    { $match: { book: bookId } },
    { $group: { _id: '$book', avgRating: { $avg: '$rating' } } }
  ]);
  return result[0]?.avgRating || 0;
};

/**
 * Paginated reviews for a book
 */
const getReviewsByBook = async ({ bookId, page = 1, limit = 5 }) => {
  return Review.find({ book: bookId })
    .populate('user', 'username')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);
};

/**
 * Total review count for a book
 */
const countReviewsByBook = (bookId) =>
  Review.countDocuments({ book: bookId });


// Check if user has already reviewed this book
const findReviewByUserAndBook = (userId, bookId) => {
  return Review.findOne({ user: userId, book: bookId });
};

// Create and save a new review
const createReview = ({ rating, comment, user, book }) => {
  const review = new Review({ rating, comment, user, book });
  return review.save();
};

//Finding review by ID
const findReviewById = (reviewId) => {
  return Review.findById(reviewId);
};

// Update a review and return the updated document
const updateReview = (reviewId, data) => {
  return Review.findByIdAndUpdate(reviewId, data, { new: true });
};

// Delete a review
const deleteReview = (reviewId) => {
   return Review.findByIdAndDelete(reviewId);
};


module.exports = {
    findReviewByUserAndBook,
    createReview,
    getAverageRating,
    getReviewsByBook,
    countReviewsByBook,
    findReviewById,
    updateReview,
    deleteReview,
};
