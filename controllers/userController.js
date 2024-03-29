const fileSys = require('fs');
const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const jwt = require('jsonwebtoken');

const users = JSON.parse(
  fileSys.readFileSync(`${__dirname}/../data/users.json`),
);

exports.checkID = (request, response, next, value) => {
  console.info(`the user id is: ${value}`);
  if (request.params.id * 1 > users.length) {
    return response.status(404).json({
      status: 'fail',
      message: 'invalid user ID',
    });
  }
  next();
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();

  res.status(200).json({
    status: 'get all users success',
    data: {
      allUsers,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  res.status(201).json({
    status: 'success',
    data: {
      tour: newUser,
    },
  });
});

exports.getUser = (request, response) => {
  response.status(200).json({
    status: 'get a user success',
    data: null,
  });
};
exports.updateUser = (request, response) => {
  response.status(200).json({
    status: 'update a user success',
    data: null,
  });
};
exports.deleteUser = (request, response) => {
  response.status(200).json({
    status: 'delete a user success',
    data: null,
  });
};
