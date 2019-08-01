// MODELS
const knex = require('../../config/connection');
const player = require('../../models/player');



// WEBSOCKET FUNCTIONS
function sendToClients(clients, response) {
    clients.forEach(client => {
        client.send(JSON.stringify(response));
    });
}



// ROUTES
module.exports = function connection(wss) {
    wss.on('connection', async function (ws) {
        console.log('Player connected');

        const numPlayers = await knex('players').select('*');
        const newPlayerName = await knex('players').select('name').orderBy('id', 'desc').limit(1);
    
        ws.playerNum = numPlayers.length;
        ws.playerName = newPlayerName[0];

        sendToClients(wss.clients, await player.getPlayers());

        ws.on('message', async function incoming(funcName) {
            const response = await player[funcName]();

            sendToClients(wss.clients, response);
        });

        ws.on('close', async () => {
            await player.deletePlayer(ws.playerID);

            console.log('Player disconnected');
        });
    });
};