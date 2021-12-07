const { StatusCodes } = require('http-status-codes');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const ApiFeatures = require('../utils/ApiFeatures');

const getAllUsers = catchAsync(async (req, res) => {
  const features = new ApiFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: users,
  });
});

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
  });
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
