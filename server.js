// REQUIRES
const app = require('./app');
const WebSocket = require('ws');



const server = app.listen(process.env.PORT, () => {
    console.log(
        '==> 🌎  Listening on port ' + process.env.PORT + '. Visit http://localhost:' + process.env.PORT + '/ in your browser.'
    );
});

const wss = new WebSocket.Server({ server });



// ROUTES
require('./routes/game/websocket')(wss);