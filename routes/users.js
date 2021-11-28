const { User, validateUser } = require('../models/user');
const { Product, validate } = require('../models/product'); 
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const cors = require('cors')


router.post('/', async (req, res) => {
    try {
         // const { error } = validateUser(req.body);
        // if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('This email is already registered with us.');
        
        const salt = await bcrypt.genSalt(10);
        user = new User({
            email: req.body.email,
            password: await bcrypt.hash (req.body.password, salt),
        });

        await user.save();

        const token = user.generateAuthToken();
        
        return res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send({ _id: user._id, name: user.name, email: user.email });

    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); }
});

router.post('/:userId/shoppingcart/:productId', auth, async (req, res) => { 
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);

        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(400).send(`The product with id "${req.params.productId}" does not exist.`);
        
        user.shoppingCart.push(product);

        await user.save();
        return res.send(user.shoppingCart);

    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
});

router.put('/:userId/shoppingcart/:productId', auth, async (req, res) => { 
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send(`The user with ID "${req.params.userId}" does not exist.`);

        const product = user.shoppingCart.id(req.params.productId);
        if (!product) return res.status(400).send(`The product with ID "${req.params.productId}" is not in your cart.`);

        product.name = req.body.name;
        product.description = req.body.description;
        product.size = req.body.size;
        product.category = req.body.category;
        product.price = req.body.price;
        product.dateModified = Date.now();

        await user.save();
        return res.send(product);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); }
});


router.delete('/:userId/shoppingcart/:productId', auth, async (req, res) => { 
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);

        let product = user.shoppingCart.id(req.params.productId);
        if (!product) return res.status(400).send(`The product with id "${req.params.productId}" is not in the users shopping cart.`);
        product = await product.remove();
        
        await user.save();
        return res.send(product);

    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;