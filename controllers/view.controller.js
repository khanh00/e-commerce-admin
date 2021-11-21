const { StatusCodes } = require('http-status-codes');

const Product = require('../models/product.model');
const Category = require('../models/category.model');
const catchAsync = require('../utils/catchAsync');

const login = (req, res) => {
  res.status(StatusCodes.OK).render('login');
};

const signup = (req, res) => {
  res.status(StatusCodes.OK).render('signup');
};

const home = (req, res) => {
  res.status(StatusCodes.OK).render('home', {
    title: 'Trang chủ',
  });
};

const getAllProduct = catchAsync(async (req, res, next) => {
  const products = await Product.find()
    .sort('-updateAt')
    .limit(10)
    .populate('category');
  const categories = await Category.find();

  res.status(StatusCodes.OK).render('product', {
    title: 'Sách',
    products,
    categories,
  });
});

module.exports = {
  login,
  signup,
  home,
  getAllProduct,
};
