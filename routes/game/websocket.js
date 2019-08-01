// MODELS
const knex = require('../../config/connection');
const player = require('../../models/player');



// WEBSOCKET FUNCTIONS
function sendToClient(client, response) {
    client.send(JSON.stringify(response));
}

function sendToClients(clients, response, exclude) {
    clients.forEach(client => {
        if (client === exclude) {
            return;
        }

        sendToClient(client, response);
    });
}



// ROUTES
module.exports = function connection(wss) {
    wss.on('connection', async function (ws) {
        console.log('Player connected');

        const numPlayers = await knex('players').select('*');
        let [newPlayer] = await knex('players').select('*').orderBy('id', 'desc').limit(1);

        newPlayer.player_number = numPlayers.length || 1;
        ws.player = newPlayer;

        const response = await player.newPlayer(ws);

        sendToClient(ws, await player.getPlayers());
        sendToClients(wss.clients, response, ws);

        ws.on('message', async function incoming(funcName) {
            const response = await player[funcName](ws.player);

            sendToClients(wss.clients, response);
        });

        ws.on('close', async () => {
            await player.deletePlayer(ws.player);

            const response = {
                function: 'deletePlayer',
                payload: ws.player
            };

            sendToClients(wss.clients, response);

            console.log('Player disconnected');
        });
    });
};