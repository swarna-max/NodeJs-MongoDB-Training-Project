const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    unique:true
  },
  bookPath: {
    type: String,
  },
  bookAuthor: {
    type: String,
  },
  bookDescription: {
    type: String,
  },
},
{
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
}

);

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;