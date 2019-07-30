// REQUIRES
require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;



// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));



// ROUTES
const htmlRoutes = require('./routes/htmlRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(htmlRoutes);
app.use(userRoutes);



//LISTEN
app.listen(PORT, function () {
    console.log(
        '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
        PORT,
        PORT
    );
});



// EXPORTS
module.exports = app;