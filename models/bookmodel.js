const mongoose = require('mongoose');

// Define a schema for the Book model
const bookSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  patientPhoneNumber: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    // required: true
  },
  gender: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a Book model based on the bookSchema
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
