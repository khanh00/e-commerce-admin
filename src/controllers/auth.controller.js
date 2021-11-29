const { promisify } = require('util');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const setCookieToken = (token, res) => {
  const expirationDate = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // date to millisecond
  );
  const options = {
    expires: expirationDate,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  };

  res.cookie('jwt', token, options);
};

const signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);

  newUser.password = undefined;
  setCookieToken(token, res);
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const message = 'Vui lòng cung cấp email và mật khẩu';
    return next(new AppError(message, StatusCodes.BAD_REQUEST));
  }

  const user = await User.findOne({ email }).select('+password');
  const isCorrectPwd = await user?.correctPassword(password, user.password);

  if (!user || !isCorrectPwd) {
    const message = 'Email hoặc mật khẩu không chính xác';
    return next(new AppError(message, StatusCodes.UNAUTHORIZED));
  }

  const token = signToken(user._id);

  user.password = undefined;
  setCookieToken(token, res);
  return res.status(StatusCodes.OK).json({
    status: 'success',
    token,
    data: { user },
  });
});

const logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({
    status: 'success',
  });
};

const protect = catchAsync(async (req, res, next) => {
  const bearer = req.headers.authorization?.split(' ')[0];
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.jwt;

  if (bearer !== 'Bearer' && !token) {
    const message = 'Bạn chưa đăng nhập! Vui lòng đăng nhập để truy cập';
    return next(new AppError(message, StatusCodes.UNAUTHORIZED));
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    const message = 'Phiên đăng nhập đã hết hạng';
    return next(new AppError(message, StatusCodes.UNAUTHORIZED));
  }

  if (freshUser.changedPasswordAfter(decode.iat)) {
    const message = 'Mật khẩu đã được thay đổi! Vui lòng đăng nhập lại';
    return next(new AppError(message, StatusCodes.UNAUTHORIZED));
  }

  req.user = freshUser;
  return next();
});

module.exports = {
  signup,
  login,
  logout,
  protect,
};
