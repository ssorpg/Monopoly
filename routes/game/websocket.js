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

async function onPlayerLose(wss, ws, playerInstructions) {
    const game_state = await gameModel.getGameState();
    let players = await playerModel.getPlayers();

    gameModel.checkTurnOnPlayerLose(ws.player, players, game_state);

    players = await playerModel.deletePlayer(ws.player);
    wss.clients = reNumberWSClients(wss.clients, players, ws);

    await tileModel.removeTileOwnership(ws.player);
    const tiles = await tileModel.getTiles();

    return {
        function: 'setBoard',
        payload: {
            players: players,
            tiles: tiles,
            currentPlayerTurn: game_state.current_player_turn,
            playerInstructions: playerInstructions || ''
        }
    };
}

function reNumberWSClients(clients, players, exclude) {
    clients.forEach((client) => { // Don't really like this function but can't think of a better way to work with sets
        if (client.player.name === exclude.player.name) {
            return;
        }

        const [foundPlayer] = players.filter((player) => { return client.player.name === player.name; });
        client.player.player_number = foundPlayer.player_number;
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

        console.log('');
        console.log(newPlayer);

        ws.player = newPlayer;

        await playerModel.updatePlayer(newPlayer);

        const tiles = await tileModel.getTiles();

        const response = {
            function: 'setBoard',
            payload: {
                players: players,
                tiles: tiles,
                currentPlayerTurn: game_state.current_player_turn
            }
        };
        sendToClients(wss.clients, response);

        ws.on('message', async data => {
            console.log('\nMessage: ' + data);

            data = JSON.parse(data);

            ws.player = await playerModel.getPlayer(ws.player);
            let response = await gameModel[data.function](ws.player);

            if (response.function === 'error') {
                sendToClient(ws, response);
            }
            else if (response.function === 'lose') {
                sendToClient(ws, response);

                response = await onPlayerLose(wss, ws, response.payload.playerInstructions);

                sendToClients(wss.clients, response);

                const players = await playerModel.getPlayers();

                if (players.length === 1) {
                    response = {
                        function: 'winner',
                        payload: {
                            player: players[0]
                        }
                    };

                    gameModel.restart();
                    sendToClients(wss.clients, response);
                }
            }
            else {
                sendToClients(wss.clients, response);
            }
        });

        ws.on('close', async () => {
            const response = await onPlayerLose(wss, ws);

            sendToClients(wss.clients, response);

            const players = await playerModel.getPlayers();

            if (players.length < 1) {
                await gameModel.restart();
            }

            console.log('\nPlayer disconnected');
        });
    });
};