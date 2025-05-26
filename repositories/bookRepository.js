// repositories/bookRepository.js
const Book = require('../models/Book');


/**
 * Create a new book in the database
 * @param {Object} bookData - Includes title, author, genre, published, and createdBy
 * @returns {Promise<Object>} - The saved book document
 */
const createBook = ({ title, author, genre, published, createdBy }) => {
  const book = new Book({ title, author, genre, published, createdBy });
  return book.save();
};


/**
 * Get paginated list of books with optional author and genre filters
 * @param {Object} params - Filters and pagination options
 * @returns {Promise<Array>} - List of books
 */
const getBooks = async ({ author, genre, page = 1, limit = 10 }) => {
  const filter = {};
  if (author) filter.author = author;
  if (genre) filter.genre = genre;

  const books = await Book.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  return books;
};


/**
 * Count total number of books matching optional filters
 * @param {Object} params - Filters like author and genre
 * @returns {Promise<Number>} - Count of books
 */
const countBooks = async ({ author, genre }) => {
  const filter = {};
  if (author) filter.author = author;
  if (genre) filter.genre = genre;

  return Book.countDocuments(filter);
};


/**
 * Fetch a single book by its ID and populate creator info
 * @param {String} id - Book ID
 * @returns {Promise<Object|null>} - Book document or null
 */
const getBookById = async (id) => {
  return Book.findById(id)
    .populate('createdBy', 'username'); 
};


/**
 * Search for books by title or author using a case-insensitive regex
 * @param {String} query - Search term
 * @returns {Promise<Array>} - Matching books
 */
const searchBooks = async (query) => {
  const regex = new RegExp(query, 'i'); // case-insensitive
  return Book.find({
    $or: [
      { title: { $regex: regex } },
      { author: { $regex: regex } },
    ]
  }).sort({ createdAt: -1 });
};


module.exports = {
  createBook,
  getBooks,
  countBooks,
  getBookById,     
  searchBooks,
};
