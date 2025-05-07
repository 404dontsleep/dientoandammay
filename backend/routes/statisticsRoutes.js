const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const Borrow = require('../models/borrow');
const Book = require('../models/book');
const User = require('../models/user');

// Validation middleware cho query params
const validateQuery = [
  query('startDate').optional().isISO8601().toDate().withMessage('startDate không hợp lệ'),
  query('endDate').optional().isISO8601().toDate().withMessage('endDate không hợp lệ'),
  query('groupBy')
    .optional()
    .isIn(['day', 'month', 'year'])
    .withMessage('groupBy phải là day, month hoặc year'),
];

// Thống kê mượn/trả sách
router.get('/borrows', validateQuery, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { startDate, endDate, groupBy = 'day' } = req.query;

    // Mặc định 30 ngày gần nhất nếu không có startDate/endDate
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Định dạng groupBy
    const dateFormat = {
      day: { $dateToString: { format: '%Y-%m-%d', date: '$borrowDate' } },
      month: { $dateToString: { format: '%Y-%m', date: '$borrowDate' } },
      year: { $dateToString: { format: '%Y', date: '$borrowDate' } },
    };

    // 1. Số lượt mượn theo ngày/tháng/năm
    const borrowStats = await Borrow.aggregate([
      { $match: { borrowDate: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: dateFormat[groupBy],
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Số lượt trả sách
    const returnStats = await Borrow.countDocuments({
      returnDate: { $gte: start, $lte: end },
      status: 'returned',
    });

    // 3. Số sách đang được mượn
    const currentlyBorrowed = await Borrow.countDocuments({
      status: 'borrowed',
    });

    // 4. Sách mượn quá hạn
    const overdue = await Borrow.countDocuments({
      status: 'borrowed',
      dueDate: { $lt: new Date() },
    });

    res.json({
      borrowStats,
      returnStats,
      currentlyBorrowed,
      overdue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thống kê theo sách
router.get('/books', validateQuery, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { startDate, endDate } = req.query;

    // Mặc định 30 ngày gần nhất
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Sách mượn nhiều nhất/ít nhất
    const bookBorrowStats = await Borrow.aggregate([
      { $match: { borrowDate: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: '$book',
          borrowCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
      {
        $project: {
          title: '$book.title',
          author: '$book.author',
          borrowCount: 1,
        },
      },
      { $sort: { borrowCount: -1 } },
    ]);

    const mostBorrowed = bookBorrowStats[0] || null;
    const leastBorrowed =
      bookBorrowStats.length > 0 ? bookBorrowStats[bookBorrowStats.length - 1] : null;

    // 2. Sách chưa từng được mượn
    const neverBorrowed = await Book.find({
      _id: { $nin: await Borrow.distinct('book') },
    }).select('title author');

    // 3. Sách bị mất/hư hỏng
    const conditionStats = await Borrow.aggregate([
      { $match: { bookCondition: { $in: ['lost', 'damaged'] } } },
      {
        $group: {
          _id: { book: '$book', condition: '$bookCondition' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id.book',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
      {
        $project: {
          title: '$book.title',
          author: '$book.author',
          condition: '$_id.condition',
          count: 1,
        },
      },
    ]);

    res.json({
      mostBorrowed,
      leastBorrowed,
      neverBorrowed,
      conditionStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thống kê theo bạn đọc
router.get('/users', validateQuery, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { startDate, endDate } = req.query;

    // Mặc định 30 ngày gần nhất
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Bạn đọc mượn nhiều nhất
    const userBorrowStats = await Borrow.aggregate([
      { $match: { borrowDate: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: '$user',
          borrowCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          borrowCount: 1,
        },
      },
      { $sort: { borrowCount: -1 } },
      { $limit: 1 },
    ]);

    const mostActiveUser = userBorrowStats[0] || null;

    // 2. Bạn đọc thường xuyên trễ hạn
    const overdueUsers = await Borrow.aggregate([
      {
        $match: {
          status: 'returned',
          returnDate: { $gt: '$dueDate' },
          borrowDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$user',
          overdueCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          overdueCount: 1,
        },
      },
      { $sort: { overdueCount: -1 } },
    ]);

    // 3. Danh sách bạn đọc đang giữ sách
    const usersWithBooks = await Borrow.aggregate([
      { $match: { status: 'borrowed' } },
      {
        $group: {
          _id: '$user',
          books: { $push: '$book' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'books',
          localField: 'books',
          foreignField: '_id',
          as: 'books',
        },
      },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          books: {
            $map: {
              input: '$books',
              as: 'book',
              in: {
                title: '$$book.title',
                author: '$$book.author',
              },
            },
          },
        },
      },
    ]);

    res.json({
      mostActiveUser,
      overdueUsers,
      usersWithBooks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;