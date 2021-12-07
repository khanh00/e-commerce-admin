const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Tên thể loại không được để trống'],
    unique: true,
    trim: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
