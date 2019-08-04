// MODELS
const playerModel = require('../../models/player');
const gameModel = require('../../models/game_state');
const tileModel = require('../../models/tile');



// WEBSOCKET FUNCTIONS
function sendToClient(client, response) {
    client.send(JSON.stringify(response));
}

function sendToClients(clients, response, exclude) {
    clients.forEach(client => {
        if (exclude && client.player === exclude.player) {
            return;
        }

        sendToClient(client, response);
    });
}

function reNumberWSClients(clients, players) {
    clients.forEach((client) => { // Don't really like this function but can't think of a better way to work with sets
        client.player.player_number = players.filter((player) => { return client.player.name === player.name; })[0].player_number;
    });

    return clients;
}



// ROUTES
module.exports = function (wss) {
    wss.on('connection', async ws => {
        const game_state = await gameModel.getGameState();

        if (game_state.in_progress) {
            ws.close();
        }

        console.log('\nPlayer connected');
        const players = await playerModel.getPlayers();

        const newPlayer = players[players.length - 1]; // Last player

        newPlayer.player_number = players.length;
        ws.player = newPlayer;

        await playerModel.updatePlayer(newPlayer);

        const tiles = await tileModel.getTiles();

        const response = {
            function: 'setBoard',
            payload: {
                players: players,
                tiles: tiles
            }
        };
        sendToClients(wss.clients, response);

        ws.on('message', async data => {
            console.log('\nMessage: ' + data);

            data = JSON.parse(data);

            const responseGame = await gameModel[data.function](ws.player);

            if (responseGame.function === 'error') {
                sendToClient(ws, responseGame);
            }
            else {
                sendToClients(wss.clients, responseGame);
            }

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
            let players = await playerModel.getPlayers();

            gameModel.checkTurnOnPlayerLeave(ws.player, players);

            players = await playerModel.deletePlayer(ws.player);
            wss.clients = reNumberWSClients(wss.clients, players);

            const tiles = await tileModel.getTiles();

            const response = {
                function: 'setBoard',
                payload: {
                    players: players,
                    tiles: tiles
                }
            };
            sendToClients(wss.clients, response);

            console.log('\nPlayer disconnected');
        });
    });
};