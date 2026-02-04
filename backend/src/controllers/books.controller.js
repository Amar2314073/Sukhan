const Book = require('../models/book');

/* ============================
   CREATE BOOK (ADMIN)
============================ */
exports.createBook = async (req, res) => {
  try {
    const { title, author, coverImage, affiliateLink, language } = req.body;

    if (!title || !coverImage || !affiliateLink) {
      return res.status(400).json({
        message: 'Title, image and affiliate link are required'
      });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author?.trim(),
      image: coverImage,
      affiliateLink,
      language
    });

    res.status(201).json({
      message: 'Book added successfully',
      book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Failed to create book' });
  }
};

/* ============================
   GET ALL BOOKS (PUBLIC)
============================ */
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json({ books });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};

/* ============================
   GET SINGLE BOOK
============================ */
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ book });
  } catch (error) {
    res.status(400).json({ message: 'Invalid book ID' });
  }
};

/* ============================
   UPDATE BOOK (ADMIN)
============================ */
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Failed to update book' });
  }
};

/* ============================
   DELETE BOOK (ADMIN – SOFT)
============================ */
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
};


exports.trackBookClick = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndUpdate(
      id,
      {
        $inc: { clicks: 1 },
        lastClickedAt: new Date()
      },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({
      redirectUrl: book.affiliateLink
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Click tracking failed' });
  }
};

