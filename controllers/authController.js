const { promisify } = require('util');
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
  let jWTtoken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    jWTtoken = req.headers.authorization.split(' ')[1];
  }
  if (!jWTtoken) {
    return next(new AppError('Invalid token. unauthorized login'), 401);
  }

  const decoded = await promisify(jwt.verify)(jWTtoken, process.env.JWT_SECRET);
  // check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('this user is no longer exist', 401));
  }
  // check if user changed password after token was issued
  if (currentUser.checkIfPasswordChangedAfterToken(decoded.iat)) {
    return next(
      new AppError('this user changed password after the token was issued'),
      401,
    );
  }

  // grant access to the protected route
  req.user = currentUser;
  next();
});

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return new AppError(
        'user does not have permission to execute this action',
        403,
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('user does not exist!', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
});

exports.resetPassword = (req, res, next) => {};
