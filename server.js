// REQUIRES
const app = require('./app');
const WebSocket = require('ws');

global.games = [];

// START SERVER
const server = app.listen(3000, () => {
    console.log('==> 🌎  Listening on port ' + process.env.PORT + '. Visit http://localhost:' + process.env.PORT + '/ in your browser.');
});

const wss = new WebSocket.Server({ server });



// ROUTES
// require('./routes/game/websocket')(wss);

require('./game/websocket')(wss);
