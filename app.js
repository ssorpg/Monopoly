// REQUIRES
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();



// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static content for the app from the "public" directory in the application directory.
app.use('/public', express.static(path.join(__dirname, '/public')));



// ROUTES
require('./routes/html/http')(app);
require('./routes/user/http')(app);
require('./routes/game/http')(app);



// EXPORTS
module.exports = app;