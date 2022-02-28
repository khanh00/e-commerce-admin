const mongoose = require('mongoose');
const removeVietnameseAccents = require('../utils/removeVietnameseAccents');

const productSchema = new mongoose.Schema({
  allowSell: {
    type: Boolean,
    default: false,
  },
  authors: [
    {
      type: String,
      trim: true,
      require: [true, 'authors: Tác giả không được để trống'],
    },
  ],
  bookLayout: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  yearPublished: {
    type: Number,
    validate: [
      {
        validator: /^SW\d{4}$/,
        message: 'yearPublished: Năm xuất bản không hợp lệ',
      },
      {
        validator() {
          return this.yearPublished < new Date().getFullYear;
        },
        message: 'yearPublished: Năm xuất bản phải nhỏ hơn năm hiện tại',
      },
    ],
  },
  description: String,
  dimensions: {
    type: String,
    trim: true,
  },
  images: [String],
  isbn: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'isbn: Mã isbn không được để trống'],
    validate: [/^\d{10}(\d{3})?$/, 'isbn: isbn không hợp lệ'],
  },
  languageBook: {
    type: String,
    enum: {
      values: ['Tiếng Anh', 'Tiếng Việt'],
      message: 'language: Giá trị không hợp lệ',
    },
    default: 'Tiếng Việt',
  },
  listPrice: {
    type: Number,
    validate: [
      {
        validator: /^[0-9]*$/,
        message: 'listPrice: Giá không hợp lệ',
      },
      {
        validator() {
          return this.listPrice > this.originalPrice;
        },
        message: 'listPrice: Giá bán phải lớn hơn giá gốc',
      },
    ],
  },
  originalPrice: {
    type: Number,
    validate: [/^[0-9]*$/, 'originalPrice: Giá không hợp lệ'],
  },
  pages: {
    type: Number,
    validate: [/^[0-9]*$/, 'pages: Số trang không hợp lệ'],
  },
  publisher: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    validate: [/^[0-9]*$/, 'quantity: Số lượng không hợp lệ'],
  },
  supplier: {
    type: String,
    trim: true,
  },
  translator: {
    type: String,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'title: Tiêu đề không được để trống'],
    validate: [/^[^+]+$/, 'title: Tiêu đề không được chứa "+"'],
  },
  title_noAccents: {
    type: String,
    select: false,
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
  weight: {
    type: Number,
    validate: [/^[0-9]*$/, 'weight: Trọng lượng không hợp lệ'],
  },
  owner: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

productSchema.index({
  title: 'text',
  title_noAccents: 'text',
  isbn: 'text',
});

productSchema.pre('save', function (next) {
  this.title_noAccents = removeVietnameseAccents(this.title);
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
