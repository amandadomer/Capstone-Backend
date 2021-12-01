const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({ 

        name: { type: String, required: true, minlength: 2, maxlength: 255 }, 
        description: { type: String, required: true },
        size: {type: String, required: true },
        price: { type: Number, required: true },
        img:  { type: String, required: true },
        reviews: { type: [String], default: [] },
        dateModified: { type: Date, default: Date.now },
});

const Product = mongoose.model('products', productSchema);

function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().required(),
        size: Joi.string().required(),
        price: Joi.number().required(),
        img: Joi.string().required(),
    });
    return schema.validate(product);
}

exports.Product = Product;
exports.validate = validateProduct;
exports.productSchema = productSchema;