// MODELS
const knex = require('../../config/connection');
const player = require('../../models/player');



// ROUTES
module.exports = function (wss) {
    wss.on('connection', async function (ws) {
        console.log('Player connected');

        const newPlayerName = await knex('players').select('name').orderBy('id', 'desc').limit(1);
        const numPlayers = await knex('players').select('*').count();
    
        ws.playerNum = numPlayers + 1;
        ws.playerName = newPlayerName;

        player.newPlayer(ws);

        console.log(ws.playerID);

        ws.on('message', async function (funcName) {
            const response = await player[funcName](1);

            wss.clients.forEach(client => {
                client.send(JSON.stringify(response));
            });
        });

        ws.on('close', async () => {
            await player.deletePlayer(ws.playerID);

            console.log('WebSocket was closed');
        });
    });
};