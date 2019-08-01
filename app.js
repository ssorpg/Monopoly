// REQUIRES
require('dotenv').config();
const express = require('express');

const app = express();



// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// ROUTES
require('./routes/html/http')(app);



// EXPORTS
module.exports = app;