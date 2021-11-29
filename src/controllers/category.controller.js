const { StatusCodes } = require('http-status-codes');
const Category = require('../models/category.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/ApiFeatures');

const getAllCategory = catchAsync(async (req, res) => {
  const features = new ApiFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const categories = await features.query;

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
});

const getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    const message = 'No category found with that ID';
    const statusCode = StatusCodes.BAD_REQUEST;
    next(new AppError(message, statusCode));
  } else {
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: { category },
    });
  }
});

const createCategory = catchAsync(async (req, res) => {
  const newCategory = await Category.create({
    name: req.body.name,
  });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: { category: newCategory },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    const message = 'No category found with that ID';
    const statusCode = StatusCodes.BAD_REQUEST;
    next(new AppError(message, statusCode));
  } else {
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: { category },
    });
  }
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    const message = 'No category found with that ID';
    const statusCode = StatusCodes.BAD_REQUEST;
    next(new AppError(message, statusCode));
  } else {
    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      data: null,
    });
  }
});

module.exports = {
  getAllCategory,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
