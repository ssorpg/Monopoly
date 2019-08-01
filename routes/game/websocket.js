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
        console.log('Player connected');

        const newPlayer = await playerModel.getLastPlayer();

        newPlayer.player_number = await playerModel.getNumPlayers();
        ws.player = newPlayer;

        await playerModel.updatePlayer(newPlayer);

        const response = {
            function: 'setPlayer',
            payload: ws.player
        };

        sendToClient(ws, await playerModel.getPlayers());
        sendToClients(wss.clients, response, ws);

        ws.on('message', async function (message) {
            console.log('Message: ' + message);

            const data = JSON.parse(message);
            console.log(data);

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