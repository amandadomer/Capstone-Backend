const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => { 
    try {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid email or password.');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.')
        
        const token = user.generateAuthToken();
        
        return res.send(token);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
});

function validateLogin(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(100).required().email(),
        password: Joi.string().min(5).max(100).required(), 
    });
    return schema.validate(req);
}

module.exports = router;