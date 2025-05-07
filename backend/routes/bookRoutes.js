const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Book = require('../models/book');

// Middleware kiểm tra ObjectId hợp lệ
const isValidObjectId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID sách không hợp lệ' });
  }
};

// CREATE
router.post(
  '/',
  [
    body('title').notEmpty().trim().withMessage('Tiêu đề là bắt buộc'),
    body('author').notEmpty().trim().withMessage('Tác giả là bắt buộc'),
    body('publishedYear')
      .notEmpty()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage('Năm xuất bản không hợp lệ'),
    body('quantity')
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('Số lượng phải là số nguyên dương'),
    body('description').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { title, author, description, publishedYear, quantity } = req.body;
      const newBook = new Book({
        title,
        author,
        description,
        publishedYear,
        quantity,
        available: quantity,
      });
      const savedBook = await newBook.save();
      res.status(201).json({ message: 'Thêm sách thành công', book: savedBook });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// READ - SEARCH
router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    if (!keyword) {
      return res.json([]);
    }
    const books = await Book.find(
      { $text: { $search: keyword } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - ALL (với pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Book.countDocuments();

    res.json({
      books,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - SINGLE
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    isValidObjectId(id, res);
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.put(
  '/:id',
  [
    body('title').optional().notEmpty().trim().withMessage('Tiêu đề không được rỗng'),
    body('author').optional().notEmpty().trim().withMessage('Tác giả không được rỗng'),
    body('publishedYear')
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage('Năm xuất bản không hợp lệ'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Số lượng phải là số nguyên không âm'),
    body('description').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { id } = req.params;
      isValidObjectId(id, res);
      const { title, author, description, publishedYear, quantity } = req.body;

      // Cập nhật quantity và available
      const updateData = { title, author, description, publishedYear };
      if (quantity !== undefined) {
        updateData.quantity = quantity;
        const currentBook = await Book.findById(id);
        const borrowed = currentBook.quantity - currentBook.available;
        updateData.available = quantity - borrowed;
        if (updateData.available < 0) {
          return res.status(400).json({ message: 'Số lượng không đủ để đáp ứng sách đang mượn' });
        }
      }

      const updateBook = await Book.findByIdAndUpdate(id, updateData, { new: true });
      if (!updateBook) {
        return res.status(404).json({ message: 'Không tìm thấy sách để cập nhật' });
      }
      res.json({ message: 'Cập nhật thành công', book: updateBook });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    isValidObjectId(id, res);
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Không tìm thấy sách để xóa' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;