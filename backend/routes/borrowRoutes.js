const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Borrow = require('../models/borrow');
const Book = require('../models/book');
const User = require('../models/user');

// Cấu hình số lượng mượn tối đa và hạn trả (có thể chuyển vào .env)
const MAX_BORROW_PER_USER = 3;
const BORROW_DAYS = 14;

// Middleware kiểm tra ObjectId hợp lệ
const isValidObjectId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
};

// CREATE - Tạo phiếu mượn
router.post(
  '/borrow',
  [
    body('userId').notEmpty().withMessage('ID người dùng là bắt buộc'),
    body('bookId').notEmpty().withMessage('ID sách là bắt buộc'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { userId, bookId } = req.body;

      // Kiểm tra ObjectId hợp lệ
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
      }
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: 'ID sách không hợp lệ' });
      }

      // Kiểm tra user tồn tại
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      // Kiểm tra sách tồn tại và còn sách
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Không tìm thấy sách' });
      }
      if (book.available <= 0) {
        return res.status(400).json({ message: 'Sách đã hết' });
      }

      // Kiểm tra số lượng sách đang mượn của user
      const userBorrows = await Borrow.countDocuments({
        user: userId,
        status: 'borrowed',
      });
      if (userBorrows >= MAX_BORROW_PER_USER) {
        return res.status(400).json({ message: `Chỉ được mượn tối đa ${MAX_BORROW_PER_USER} sách` });
      }

      // Tạo phiếu mượn
      const borrowDate = new Date();
      const dueDate = new Date(borrowDate);
      dueDate.setDate(borrowDate.getDate() + BORROW_DAYS);

      const newBorrow = new Borrow({
        user: userId,
        book: bookId,
        borrowDate,
        dueDate,
      });

      // Cập nhật số lượng sách
      book.available -= 1;
      await book.save();

      const savedBorrow = await newBorrow.save();
      res.status(201).json({ message: 'Tạo phiếu mượn thành công', borrow: savedBorrow });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// UPDATE - Trả sách và đánh dấu tình trạng
router.put(
  '/return/:id',
  [
    body('bookCondition')
      .isIn(['normal', 'damaged', 'lost'])
      .withMessage('Tình trạng sách không hợp lệ'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { id } = req.params;
      const { bookCondition } = req.body;
      isValidObjectId(id, res);

      const borrow = await Borrow.findById(id);
      if (!borrow) {
        return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
      }
      if (borrow.status === 'returned') {
        return res.status(400).json({ message: 'Sách đã được trả' });
      }

      // Cập nhật phiếu mượn
      borrow.status = 'returned';
      borrow.returnDate = new Date();
      borrow.bookCondition = bookCondition;

      // Cập nhật số lượng sách
      const book = await Book.findById(borrow.book);
      if (bookCondition === 'lost') {
        book.quantity -= 1;
        if (book.quantity < 0) {
          return res.status(400).json({ message: 'Số lượng sách không hợp lệ' });
        }
        // Không tăng available khi sách bị mất
      } else {
        book.available += 1;
      }
      await book.save();

      const updatedBorrow = await borrow.save();
      res.json({ message: 'Trả sách thành công', borrow: updatedBorrow });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// READ - Danh sách phiếu mượn (với pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const borrows = await Borrow.find()
      .populate('user', 'name email')
      .populate('book', 'title author')
      .sort({ borrowDate: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Borrow.countDocuments();

    res.json({
      borrows,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - Phiếu mượn theo user (sách đang giữ)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    isValidObjectId(userId, res);

    const borrows = await Borrow.find({
      user: userId,
      status: 'borrowed',
    })
      .populate('user', 'name email')
      .populate('book', 'title author')
      .sort({ borrowDate: -1 });

    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - Chi tiết phiếu mượn
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    isValidObjectId(id, res);

    const borrow = await Borrow.findById(id)
      .populate('user', 'name email')
      .populate('book', 'title author');
    if (!borrow) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
    }

    res.json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;