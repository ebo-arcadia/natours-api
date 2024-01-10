const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user name is required!'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'email is required!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'password is required!'],
    min: [8, 'password must be least 8 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirm email'],
    validate: {
      validator: function (item) {
        return item === this.password;
      },
      message: 'password must match',
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;