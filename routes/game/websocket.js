// MODELS
const playerModel = require('../../models/player');
const gameModel = require('../../models/game_state');



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
module.exports = function (wss) {
    wss.on('connection', async function (ws) {
        console.log('\nPlayer connected');
        const players = await playerModel.getPlayers();

        const newPlayer = players[0];

        newPlayer.player_number = players.length || 1;
        ws.player = newPlayer;

        let response = {
            function: 'setPlayers',
            payload: players
        };
        sendToClient(ws, response);

        response = {
            function: 'setPlayer',
            payload: newPlayer
        };
        sendToClients(wss.clients, response, ws);

        await playerModel.updatePlayer(newPlayer);

        ws.on('message', async function (message) {
            console.log('\nMessage: ' + message);

            const data = JSON.parse(message);
            // console.log(data);

            const response = await gameModel[data.function](ws.player);
            sendToClients(wss.clients, response);
        });

        ws.on('close', async () => {
            const response = await playerModel.deletePlayer(ws.player);

            sendToClients(wss.clients, response);

            console.log('Player disconnected');
        });
    });
};