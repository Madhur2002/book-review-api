// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  author:     { type: String, required: true },
  genre:      { type: String, required: true }, 
  published:  { type: Date },
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
