const util = require('util');

const makeQueue = require('./eventQueue').makeQueue;
const makePlayer = require('./player').makePlayer;
const makePlayers = require('./players').makePlayers;
const makeBoard = require('./board').makeBoard;

module.exports.makeGame = async (id, wss) => {
  let game = Object.create(gameProto);

  game.id = id;
  game.wss = wss;
  game.queue = makeQueue();
  game.state = 'waitPlayers';
  game.board = await makeBoard();
  game.players = makePlayers();

  return game;
}

const stateTable = {
  'waitPlayers': {
    'addPlayer': 'waitPlayers', // stays here until nplayers === 2
    'delPlayer': 'delPlayer'
  },
  'waitStart': {
    'addPlayer': 'addPlayer', // stays here until start or nplayers ===  4
    'startGame': 'startGame',
    'delPlayer': 'delPlayer',
    'nextPlayer': 'nextPlayer'
  },
  "startGame": {
    "nextPlayer": 'nextPlayer', // enqueue 'nextPlayer'
    'delPlayer': 'delPlayer'
  },
  "nextPlayer": {
    'delPlayer': 'delPlayer'
  },
  "waitRoll": {
    'rollDice': 'rollDice'
  },
  "waitPurchase": {
    "purchaseProperty": 'purchase',
    "passProperty": 'pass'
  }
}


let gameProto = {
  state: undefined,
  players: null,
  currentPlayer: undefined,
  currentUuid: undefined,
  started: false,
  //
  // game loop, wait for event in queue then go through
  // state table to see what to do next
  //
  async run() {
    while (true) {
      let item = await this.queue.waitEvent();
      this.stateTransition(item.event, item.data, item.ws);
    }
  },
  stateTransition(event, data, ws) {
    try {
      console.log(`State: ${this.state} Event: ${event} Data: ${JSON.stringify(data)} uuid: ${ws.uuid}`);
      this[stateTable[this.state][event]](data, ws);
    } catch (err) {
      console.log(stateTable[this.state]);
      console.log(err)
    }
  },
  mustBeCurrent(ws) {
    if(ws.uuid !== this.players.getUuid(this.currentPlayer)) {
      throw `uuid ${ws.uuid} sent message when not current`;
    }
  },
  sendToClient(message, ws) {
    ws.send(JSON.stringify(message));
  },
  sendToClients(message) {
    let str = JSON.stringify(message);

    this.wss.clients.forEach((ws) => {
      ws.send(
        str
      )
    })
  },
  async _addPlayer(data, ws) {
    let player = this.players.add(data, ws);

    this.sendToClient({
      function: 'setUuid',
      payload: {
        uuid: this.players.getUuid(player)
      }
    },ws);
    this.sendToClients({
      function: 'setBoard',
      payload: {
        players: this.players.get(),
        tiles: this.board.tiles,
        currentPlayerTurn: 1
      }
    });
  },
  async delPlayer(data, ws) {
    this.players.delete(data.ws);
    //
    // if game running and current player is not deleted player
    //
    if (false) {
      this.stateTransition('nextPlayer', data, ws);
    }
  },
  async waitPlayers(data, ws) {
    await this._addPlayer(data, ws);

    if (this.players.length === 2) {
      this.sendToClients({
        function: 'canStart',
        data: {

        }
      })
      this.state = 'waitStart';
    }
  },
  async addPlayer(data, ws) {
    await this._addPlayer(data, ws);

    if (this.players.length === 4) {
      this.stateTransition('startGame', data, ws);
    }
  },
  startGame(data, ws) {
    this.started = true;
    this.players.reset();
    this.sendToClients({
      function: 'started',
      payload: {

      }
    });
    this.stateTransition('nextPlayer', data, ws);
  },
  nextPlayer(data, ws) {
    // let ws;
    console.log('\n\u001B[31mlet the good times roll!\u001B[0m\n');
    this.currentPlayer = this.players.next();
    this.sendToClient({
      function: 'yourTurn',
      payload: {
      }
    }, this.players.getWs(this.currentPlayer));
    this.state = 'waitRoll';
  },
  async rollDice(data, ws) {
    this.mustBeCurrent(ws);

    let tile;
    let instructions = 'buy or pass';
    let nextPlayer = false;

    const rolls = {
      die1: Math.floor((Math.random() * 6) + 1),
      die2: Math.floor((Math.random() * 6) + 1)
    };
    this.currentPlayer.position += rolls.die1 + rolls.die2;
    this.currentPlayer.position %= 24;
    tile = this.board.tiles[this.currentPlayer.position];

    if(tile.type === 'property') {
      if(tile.owner && tile.owner !== this.currentPlayer.uuid) {
        //
        // todo add money gained to other
        //
        this.currentPlayer.money -= tile.money_lost;
        instructions = `you paid ${tile.money_lost}`;
        nextPlayer = true;
      } else {
        instructions = 'Purchase ' + tile.name + ' for $' + tile.property_cost + '?';
      }
    }

    this.sendToClients({
      function: 'doTurn',
      payload: {
        players: this.players.get(),
        rolls: rolls,
        playerInstructions: instructions
      }
    });
    if(nextPlayer) {
      this.nextPlayer();
    } else {
      this.state = 'waitPurchase'
    }
  },
  pass(data, ws) {
    this.mustBeCurrent(ws);

    console.log('passing on purchase');
    this.nextPlayer();
  },
  purchase(data, ws) {
    this.mustBeCurrent(ws);

    tile = this.board.tiles[this.currentPlayer.position];
    this.currentPlayer.money -= tile.property_cost;
    tile.owner = this.currentPlayer.uuid;

    const instructions = this.currentPlayer.name + ' purchased ' + tile.name + ' for $' + tile.property_cost + '.';

    this.sendToClients({
        function: 'propertyPurchased',
        payload: {
            players: this.players.get(),
            tileOwner: this.currentPlayer,
            playerInstructions: instructions,
            currentPlayerTurn: this.currentPlayer.name
        }
    });

    this.nextPlayer();

  }
}
