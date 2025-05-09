const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    borrowDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned'],
      default: 'borrowed',
    },
    bookCondition: {
      type: String,
      enum: ['normal', 'damaged', 'lost', null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

borrowSchema.index({ borrowDate: 1 });
borrowSchema.index({ returnDate: 1 });
borrowSchema.index({ user: 1, status: 1 });
borrowSchema.index({ book: 1, status: 1 });
borrowSchema.index({ dueDate: 1, status: 1 });

module.exports = mongoose.model('Borrow', borrowSchema);