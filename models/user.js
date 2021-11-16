const mongoose = require('mongoose');
const Joi = require('joi');
const { productSchema } = require('./product');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, unique: true, required: true, minlength: 5, maxlength: 100 },
    password: { type: String, require: true,  minlength: 5, maxlength: 100 },
    shoppingCart: { type: [productSchema], default: [] },
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(100).required().email(),
    password: Joi.string().min(5).max(100).required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;