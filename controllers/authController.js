const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/tourError');

const getJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const jwtToken = getJwtToken(newUser._id);
  res.status(201).json({
    status: 'user sign up success',
    jwtToken,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('please provide both email and password'));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect emails or password'));
  }

  const token = getJwtToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // getting the token and check if it is there
  let jWTtoken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    jWTtoken = req.headers.authorization.split(' ')[1];
  }
  // verify if token is valid
  if (!jWTtoken) {
    return next(new AppError('Invalid token. unauthorized login'), 401);
  }
  // check if user still exist

  // check if user changed password after token was issued

  next();
});
