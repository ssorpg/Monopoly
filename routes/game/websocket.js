// MODELS
const knex = require('../../config/connection');



// WEBSOCKET FUNCTIONS
async function getUsers(ws, req) {
    const resUsers = await knex('users').select('*').where('game_id', '=', req.params.id);

    ws.clients.forEach(client => {
        client.send({
            type: 'users',
            users: resUsers
        });
    });
}



// ROUTES
module.exports = function (wss) {
    wss.once('connection', function connection(ws) {
        console.log('User connected');

        ws.on('message', function incoming(message) {
            // message(wss, req);
            console.log(message);
        });

        ws.on('close', () => {
            console.log('WebSocket was closed');
        });
    });
};