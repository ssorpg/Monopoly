const util = require('util');

const makeQueue = require('./eventQueue');
const makePlayers = require('./players');
const makeBoard = require('./board');
const stateTable = require('./stateTable');

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

let gameProto = {
  state: undefined,
  players: null,
  player: undefined,
  uuid: undefined,
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
  async delPlayer(data, ws) {
    this.players.delete(data.ws);
    //
    // if game running and current player is not deleted player
    //
    if (false) {
      this.stateTransition('nextPlayer', data, ws);
    }
  },
  waitPlayers(data, ws) {
    this.players.add(data, ws, this.board.tiles);

    if (this.players.length === 2) {
      this.players.send({
        function: 'canStart',
        payload: {
        }
      });
      this.state = 'waitStart';
    }
  },
  addPlayer(data, ws) {
    this.players.add(data, ws, this.board.tiles);

    if (this.players.length === 4) {
      this.stateTransition('startGame', data, ws);
    }
  },
  startGame(data, ws) {
    this.started = true;
    this.players.reset();
    this.players.send({
      function: 'started',
      payload: {}
    });
    this.stateTransition('nextPlayer', data, ws);
  },
  nextPlayer(data, ws) {
    console.log('\n\u001B[31mlet the good times roll!\u001B[0m\n');
    this.player = this.players.next();
    this.uuid = this.players.getUuid(this.player);
    this.players.send({
      function: 'yourTurn',
      payload: {}
    }, this.player);
    this.state = 'waitRoll';
  },
  rollDice(data, ws) {
    this.mustBeCurrent(ws);

    let tile;
    let instructions = '';
    let nextPlayer = false;
    let previousPosition = this.player.position;

    const rolls = {
      die1: Math.floor((Math.random() * 6) + 1),
      die2: Math.floor((Math.random() * 6) + 1)
    };
    this.player.position += rolls.die1 + rolls.die2;
    this.player.position %= 24;
    if (this.player.position < previousPosition) {
      instructions = 'Passed Go, collect $100. ';
    }
    tile = this.board.tiles[this.player.position];

    if (tile.type === 'property') {
      if (tile.owner && tile.owner !== this.uuid) {
        let rent = tile.property_cost / 4;

        this.player.money -= rent;
        this.players.get(tile.owner).money += rent;
        instructions += `you paid ${rent}`;
        nextPlayer = true;
      } else {
        instructions += 'Purchase ' + tile.name + ' for $' + tile.property_cost + '?';
      }
    } else if (tile.type === 'tax') {
      instructions += `${this.player.name} paid $${tile.money_lost} in taxes`;
      this.player.money -= tile.money_lost;
      nextPlayer = true;
    }

    this.players.send({
      function: 'doTurn',
      payload: {
        players: this.players.get(),
        rolls: rolls,
        playerInstructions: instructions
      }
    });
    if (nextPlayer) {
      this.nextPlayer();
    } else {
      this.state = 'waitPurchase'
    }
  },
  pass(data, ws) {
    this.mustBeCurrent(ws);
    tile = this.board.tiles[this.player.position];
    this.players.send({
      function: 'propertyPassed',
      payload: {
        playerInstructions: this.player.name + ' decided not to purchase ' + tile.name + '.',
        currentPlayerTurn: this.player.name
      }
    });
    this.nextPlayer();
  },
  purchase(data, ws) {
    this.mustBeCurrent(ws);

    tile = this.board.tiles[this.player.position];
    this.player.money -= tile.property_cost;
    tile.owner = this.uuid;

    const instructions = this.player.name + ' purchased ' + tile.name + ' for $' + tile.property_cost + '.';

    this.players.send({
      function: 'propertyPurchased',
      payload: {
        players: this.players.get(),
        tileOwner: this.player,
        playerInstructions: instructions,
        currentPlayerTurn: this.player.name
      }
    });
    this.nextPlayer();
  },
  mustBeCurrent(ws) {
    if (ws.uuid !== this.uuid) {
      throw `uuid ${ws.uuid} sent message when not current`;
    }
  },
}
