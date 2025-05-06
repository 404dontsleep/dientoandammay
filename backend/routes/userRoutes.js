const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const User = require("../models/user");

// Middleware kiểm tra ObjectId hợp lệ
const isValidObjectId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID người dùng không hợp lệ" });
  }
};

// CREATE - Thêm người dùng mới
router.post(
  "/add",
  [
    body("name").notEmpty().trim().withMessage("Tên là bắt buộc"),
    body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),
    body("phone")
      .optional()
      .matches(/^\d{10,12}$/)
      .withMessage("Số điện thoại không hợp lệ (10-12 chữ số)"),
    body("address")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Địa chỉ quá dài"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, email, phone, address } = req.body;
      const newUser = new User({ name, email, phone, address });
      const savedUser = await newUser.save();
      res
        .status(201)
        .json({ message: "Thêm người dùng thành công", user: savedUser });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
      res.status(500).json({ message: error.message });
    }
  }
);

// READ - Tất cả người dùng (với pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments();

    res.json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - Chi tiết người dùng
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    isValidObjectId(id, res);
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - Tìm kiếm người dùng
router.get("/search", async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    if (!keyword) {
      return res.json([]);
    }
    const users = await User.find(
      { $text: { $search: keyword } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE - Cập nhật người dùng
router.put(
  "/:id",
  [
    body("name")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Tên không được rỗng"),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Email không hợp lệ"),
    body("phone")
      .optional()
      .matches(/^\d{10,12}$/)
      .withMessage("Số điện thoại không hợp lệ (10-12 chữ số)"),
    body("address")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Địa chỉ quá dài"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { id } = req.params;
      isValidObjectId(id, res);
      const { name, email, phone, address } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, phone, address },
        { new: true }
      );
      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy người dùng để cập nhật" });
      }
      res.json({ message: "Cập nhật thành công", user: updatedUser });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE - Xóa người dùng
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    isValidObjectId(id, res);
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng để xóa" });
    }
    res.json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
