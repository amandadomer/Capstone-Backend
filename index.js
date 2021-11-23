const connectDB = require('./startup/db');
const multer = require('multer')
const express = require('express');
const products = require('./routes/products');
const users = require('./routes/users');
const auth = require('./routes/auth');
const app = express();

connectDB();

app.use(express.json());
app.use('/api/products', products);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});