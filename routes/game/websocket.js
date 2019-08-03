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
        const game_state = await gameModel.getGameState();

        if (game_state.in_progress) {
            ws.close();
        }

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

        playerModel.updatePlayer(newPlayer);

        ws.on('message', async function (message) {
            console.log('\nMessage: ' + message);

            const data = JSON.parse(message);
            // console.log(data);

            const responseGame = await gameModel[data.function](ws.player);
            sendToClients(wss.clients, responseGame);

            // see if any one lose
            const responseLosers = await gameModel.checkLosers();
            if (0 !== responseLosers.payload.losers.length) {
                // delete losers in db
                responseLosers.payload.losers.forEach(async (thisLoser) => {
                    await playerModel.deletePlayer(thisLoser);
                });
                // send back losers' list and survivors' list if someone loses
                sendToClients(wss.clients, responseLosers);
            }
        });

        ws.on('close', async () => {
            const response = await playerModel.deletePlayer(ws.player);
            let game_state = await gameModel.getGameState();
            game_state.current_player_turn++;

            await gameModel.updateCurPlayerTurn(game_state);

            sendToClients(wss.clients, response);

            console.log('\nPlayer disconnected');
        });
    });
};