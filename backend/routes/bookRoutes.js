const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// CREATE
router.post('/add', async (req, res) => {
    try {
        const { title, author, description, publishedYear } = req.body;
        if (!title || !author || !publishedYear) {
            return res.status(400).json({ message: 'Tiêu đề và tác giả và năm xuất bản là bắt buộc là bắt buộc' });
        }

        const newBook = new Book({ title, author, description, publishedYear });
        const savedBook = await newBook.save();
        res.status(201).json({ message: 'Thêm sách thành công', book: savedBook });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ - SEARCH
router.get('/search', async (req, res) => {
    try {
        const keyword = req.query.title || '';
        const regex = new RegExp(keyword, 'i');
        const books = await Book.find({ title: { $regex: regex } });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { title, author, description, publishedYear } = req.body;

        const updateBook = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, description, publishedYear },
            { new: true }
        );

        if (!updateBook) {
            return res.status(404).json({ message: 'Không tìm thấy sách để cập nhật.' });
        }

        res.json({ message: 'Cập nhật thành công!', book: updateBook });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook  = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({ message: 'Không tìm thấy sách để xóa.' });
        }

        res.json({ message: 'Xóa sách thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ – Tất cả sách
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        res.json(book);
    } catch (error) {
        console.error('Lỗi lấy thông tin sách:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

module.exports = router;
