const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\d{10,12}$/, 'Số điện thoại không hợp lệ (10-12 chữ số)'],
        default: '',
    },
    address: {
        type: String,
        trim: true,
        maxlength: 200,
        default: '',
    },
    },
    {
    timestamps: true,
    }
);

// Tạo text index để tối ưu tìm kiếm
userSchema.index({ name: 'text', email: 'text' });

module.exports = mongoose.model('User', userSchema);