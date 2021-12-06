const connectDB = require('./startup/db');
const cors = require('cors')
const express = require('express');
const products = require('./routes/products');
const users = require('./routes/users');
// const stripe = require('./routes/checkout');
const auth = require('./routes/auth');
const app = express();


connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/products', products);
app.use('/api/users', users);
// app.use('/api/stripe');
app.use('/api/auth', auth);
// app.use("/api/")

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});