const util = require('util');

const makePlayer = require('./player');

module.exports = function() {
  return Object.create(props);
}

let props = {
  uuidPlayerMap: new Map(),
  playerUuidMap: new Map(),
  playerWsMap: new Map(),
  players: [],
  currentPlayer: 0,
  get length() {
    return this.players.length;
  },
  reset: function() {
    this.currentPlayer = 0;
  },
  next: function() {
    this.currentPlayer++;
    this.currentPlayer %= this.players.length;

    return this.players[this.currentPlayer];
  },
  add: function(player, ws, tiles) {
    player = makePlayer(player);

    player.id = this.players.length + 1;
    player.player_number = player.id;
    this.players.push(player);
    this.uuidPlayerMap.set(ws.uuid, player);
    this.playerUuidMap.set(player, ws.uuid);
    this.playerWsMap.set(player, ws);

    this.send({
      function: 'setUuid',
      payload: {
        uuid: this.getUuid(player)
      }
    }, player);
    this.send({
      function: 'setBoard',
      payload: {
        players: this.players,
        tiles: tiles,
        currentPlayerTurn: 1
      }
    });
    return player;
  },
  get: function(uuid) {
    if (uuid) {
      return this.uuidPlayerMap.get(uuid);
    } else {
      return this.players;
    }
  },
  getUuid: function(player) {
    return this.playerUuidMap.get(player);
  },
  getWs: function(player) {
    return this.playerWsMap.get(player);
  },
  delete: function(uuid) {
    let deleting = get(uuid);

    if (deleting) {
      console.log('deleting', deleting.name);

      this.players.map(player => player.uuid !== uuid);
      this.uuidPlayerMap.delete(uuid);
      this.playerUuidMap.delete(player);
    }
  },
  send: function(message, player) {
    let str = JSON.stringify(message);
    if (player) {
      this.getWs(player).send(str);
    } else {
      this.players.forEach(player => {
        this.getWs(player).send(str);
      });
    }
  }
}
