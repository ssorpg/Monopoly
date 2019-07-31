// REQUIRES
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;



// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(express.static('public'));
// Serve static content for the app from the "public" directory in the application directory.
app.use("/public", express.static(path.join(__dirname, "/public")));



// ROUTES
const htmlRoutes = require('./routes/htmlRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

app.use(htmlRoutes);
app.use(userRoutes);
app.use(gameRoutes);



//LISTEN
app.listen(PORT, function () {
    console.log(
        '==> 🌎  Listening on port ' + PORT + '. Visit http://localhost:' + PORT + '/ in your browser.'
    );
});



// EXPORTS
module.exports = app;