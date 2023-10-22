const express = require('express');

const router = express.Router();

const getAllUsers = (request, response) => {
  response.status(200).json({
    status: 'get all users success',
    data: null,
  });
};
const createUser = (request, response) => {
  response.status(200).json({
    status: 'create a user success',
    data: null,
  });
};
const getUser = (request, response) => {
  response.status(200).json({
    status: 'get a user success',
    data: null,
  });
};
const updateUser = (request, response) => {
  response.status(200).json({
    status: 'update a user success',
    data: null,
  });
};
const deleteUser = (request, response) => {
  response.status(200).json({
    status: 'delete a user success',
    data: null,
  });
};

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
