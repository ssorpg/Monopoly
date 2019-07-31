// MODELS
const knex = require('../../config/connection');



// WEBSOCKET FUNCTIONS
async function getUsers(game_id) {
    const users = await knex('users').select('*').where('game_id', '=', game_id);

    return {
        function: 'setPlayers',
        payload: users
    };
}

async function rollDice() {
    var rval = {
        die1: 0,
        die2: 0
    };

    rval.die1 = Math.floor((Math.random() * 6) + 1);
    rval.die2 = Math.floor((Math.random() * 6) + 1);

    return {
        function: 'setRoll',
        payload: rval
    };
}



const callbacks = {
    getUsers: getUsers,
    rollDice: rollDice
};



// ROUTES
module.exports = function (wss) {
    wss.on('connection', function connection(ws) {
        console.log('User connected');

        ws.on('message', async function incoming(funcName) {
            const response = await callbacks[funcName](1);

            wss.clients.forEach(client => {
                client.send(JSON.stringify(response));
            });
        });

        ws.on('close', () => {
            console.log('WebSocket was closed');
        });
    });
};