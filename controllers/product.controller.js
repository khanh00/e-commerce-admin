const { StatusCodes } = require('http-status-codes');
const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');

const Product = require('../models/product.model');
const ApiFeatures = require('../utils/ApiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/products');
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    cb(null, `${req.body.isbn}-${Date.now()}.${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else {
    const message = 'Không phải hình ảnh! Hãy thử lại.';
    cb(new AppError(message, StatusCodes.BAD_REQUEST));
  }
};

const upload = multer({ storage, fileFilter });

const uploadImages = upload.array('images');

const getAllProducts = catchAsync(async (req, res) => {
  const features = new ApiFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products = await features.query;

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
});

const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    const message = 'No category found with that ID';
    const statusCode = StatusCodes.BAD_REQUEST;
    next(new AppError(message, statusCode));
  } else {
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: { product },
    });
  }
});

const createProduct = catchAsync(async (req, res, next) => {
  req.body.images = ['default.jpg'];
  if (req.files?.length > 0) {
    req.body.images = [...req.files.map((file) => file.filename)];
  }
  const newProduct = await Product.create(req.body);
  return res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: { product: newProduct },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    const message = 'No category found with that ID';
    const statusCode = StatusCodes.BAD_REQUEST;
    next(new AppError(message, statusCode));
  } else {
    if (req.file) product.images = [...req.files.filename];

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: { product },
    });
  }
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    const message = 'No category found with that ID';
    next(new AppError(message, StatusCodes.BAD_REQUEST));
  } else {
    product.images.forEach(async (image) => {
      if (image !== 'default.jpg')
        await promisify(fs.unlink)(`public/img/products/${image}`);
    });
    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      data: null,
    });
  }
});

module.exports = {
  uploadImages,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
