const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const { productSchema } = require('./product');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, minlength: 5, maxlength: 100 },
  password: { type: String, require: true,  minlength: 5, maxlength: 100 },
  shoppingCart: { type: [productSchema], default: [] },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, name: this.name }, config.get('jwtSecret'));
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(100).required().email(),
    password: Joi.string().min(5).max(100).required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;