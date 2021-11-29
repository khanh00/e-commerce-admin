const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Vui lòng cung cấp tên của bạn'],
  },
  email: {
    type: String,
    require: [true, 'Email không được để trống'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email không hợp lệ'],
  },
  photo: String,
  password: {
    type: String,
    require: [true, 'Vui lòng cung cấp mật khẩu'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Vui lòng nhập lại mật khẩu'],
    validate: {
      validator(passwordConfirm) {
        return passwordConfirm === this.password;
      },
      message: 'Mật khẩu không giống nhau',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

const preSave = async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;
  }
  [this.name] = this.email.split('@');
  next();
};

const correctPassword = async function (cadidatePassword, userPassword) {
  const isCorrect = await bcrypt.compare(cadidatePassword, userPassword);
  return isCorrect;
};

const changedPasswordAfter = function (jwtTimestamp) {
  let isChanged = true;

  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000; // in second
    isChanged = changedTimestamp > jwtTimestamp;
  }
  return isChanged;
};

userSchema.pre('save', preSave);
userSchema.methods.correctPassword = correctPassword;
userSchema.methods.changedPasswordAfter = changedPasswordAfter;

const User = mongoose.model('User', userSchema);

module.exports = User;
