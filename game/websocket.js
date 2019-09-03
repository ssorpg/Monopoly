// MODELS
const playerModel = require('../models/player');
const gameModel = require('../models/game_state');
const tileModel = require('../models/tile');
const makeGame = require('./game').makeGame;
const shortid = require('shortid');
//
// need to handle multiples
//
let game;



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

    const [foundPlayer] = players.filter((player) => {
      return client.player.name === player.name;
    });

    if (foundPlayer) {
      client.player.player_number = foundPlayer.player_number;
    } else {
      client.player.lost = true;
    }
  });

  console.log(clients);

  return clients;
}



// ROUTES
module.exports = async function(wss) {
  game = await makeGame(1, wss);
  game.run();
  wss.on('connection', async (ws, req) => {
    ws.uuid = shortid.generate();
    sendToClient(ws, {function:'addNewPlayer',payload:{}})
    // const game_state = await gameModel.getGameState();
    //
    // if (game.started) {
    //   ws.close();
    // }
    //
    // console.log('\nPlayer connected');
    // console.log(req.connection.remoteAddress, req.connection.remotePort)
    // const players = await playerModel.getPlayers();
    //
    // const newPlayer = players[players.length - 1]; // Last player
    //
    // newPlayer.player_number = players.length;
    //
    // console.log('');
    // console.log(newPlayer);
    //
    // ws.player = newPlayer;
    //
    // await playerModel.updatePlayer(newPlayer);
    //
    // const tiles = await tileModel.getTiles();
    //
    // const response = {
    //   function: 'setBoard',
    //   payload: {
    //     players: players,
    //     tiles: tiles,
    //     currentPlayerTurn: game_state.current_player_turn
    //   }
    // };
    // sendToClients(wss.clients, response);

    ws.on('message', async (event) => {
      event = JSON.parse(event);
      console.log(event);
      event.data.remoteEndPoint = ws._socket.remoteAddress + ':' + ws._socket.remotePort;
      event.ws = ws;
      game.queue.enqueueEvent(event);
      return;





      ws.player = await playerModel.getPlayer(ws.player);
      let response = await gameModel[data.function](ws.player);

      if (response.function === 'error') {
        sendToClient(ws, response);
      } else if (response.function === 'lose') {
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
      } else {
        sendToClients(wss.clients, response);
      }
    });

    ws.on('close', async () => {
      console.log('\nPlayer disconnected');
      let event = {
        event: 'delPlayer',
        data: {
          ws: ws
        }
      }
      game.queue.enqueueEvent(event);
      return;


      const players = await playerModel.getPlayers();

      if (players.length < 1) {
        await gameModel.restart();
        return;
      } else if (ws.player.lost) {
        return;
      }

      const response = await onPlayerLose(wss, ws);

      sendToClients(wss.clients, response);
    });
  });
};
