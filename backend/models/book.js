const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    publishedYear: {
      type: Number,
      required: true,
      min: 1000,
      max: new Date().getFullYear(),
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    available: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ title: "text", author: "text", description: "text" });

module.exports = mongoose.model("Book", bookSchema);
