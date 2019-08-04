// REQUIRES
const knex = require('../config/connection');
require('dotenv').config();



// MODELS
const playerModel = require('./player');
const tileModel = require('./tile');



// FUNCTIONS
async function getGameState() {
    const [game_state] = await knex('game_state').select('*');
    // console.log(game_state);

    return game_state;
}

async function updateGameState(game_state) {
    console.log(game_state);
    await knex('game_state').update(game_state).where('id', game_state.id);
}

function isTurn(game_state, player) {
    if (player.player_number !== game_state.current_player_turn) {
        return 'It\'s not your turn';
    }
}

function canDoTurn(game_state, player) {
    if (!process.env.NODE_ENV) {
        return;
    }

    const notTurn = isTurn(game_state, player);

    if (notTurn) {
        return notTurn;
    }
    else if (game_state.paused) {
        return 'The game is currently paused.';
    }
}

function rollDice() {
    const rolls = {};

    rolls.die1 = Math.floor((Math.random() * 6) + 1);
    rolls.die2 = Math.floor((Math.random() * 6) + 1);

    return rolls;
}

function newPlayerPos(player, rolls) {
    const dieSum = rolls.die1 + rolls.die2;

    if (player.position + dieSum >= 24) {
        player.money += 200;
    }

    player.position = (player.position + dieSum) % 24;

    return player;
}

async function nextPlayerTurn(game_state, players) {
    // if (!process.env.NODE_ENV) {
    //     return game_state.current_player_turn;
    // }

    players = players || await playerModel.getPlayers(); // If players provided, no need to spend time getting from DB
    let numPlayers = players.length;

    if (numPlayers < 2) {
        numPlayers = 2;
    }

    game_state.current_player_turn = game_state.current_player_turn % numPlayers;
    game_state.current_player_turn++;

    return game_state;
}

async function unlockGame(game_state) {
    game_state = await nextPlayerTurn(game_state);
    game_state.paused = false;
    game_state = checkGameInProgress(game_state);

    updateGameState(game_state);
}

function checkGameInProgress(game_state) {
    if (!game_state.in_progress && game_state.current_player_turn === 3) {
        game_state.in_progress = true;
    }

    return game_state;
}

async function checkLosers() {
    let losers = await knex('players').select('*').where('money', '<=', 0);
    let survivors = await knex('players').select('*').where('money', '>', 0);

    return {
        function: 'checkLosers',
        payload : {
            losers: losers,
            survivors : survivors
        }
    };
}

async function passProperty () {
    let game_state = await getGameState();

    game_state = await nextPlayerTurn(game_state);
    game_state.paused = false;

    updateGameState(game_state);

    return {
        function: 'wait'
    };
}

async function hasTileOwner(player, curTile) {
    let tileOwner = curTile.owner;

    if (tileOwner === player.name) {
        return player;
    }

    const moneyExchanged = curTile.property_cost / 2;

    tileOwner = await playerModel.getPlayer(tileOwner);

    player.money -= moneyExchanged;
    tileOwner.money += moneyExchanged;

    await playerModel.updatePlayer(tileOwner);
    await playerModel.updatePlayer(player);

    return player.name + ' paid $' + moneyExchanged + ' in rent to ' + tileOwner.name + '.';
}



// EXPORTS
module.exports = {
    getGameState: getGameState,
    updateGameState: updateGameState,
    nextPlayerTurn: nextPlayerTurn,
    checkLosers: checkLosers,
    passProperty: passProperty,

    purchaseProperty: async function (player) {
        const game_state = await getGameState();
        const notTurn = isTurn(game_state, player);

        if (notTurn) {
            return { function: 'error', payload: { text: notTurn } };
        }

        const curTile = await tileModel.getTile(player.position);

        player.money -= curTile.property_cost;
        curTile.owner = player.name;

        await playerModel.updatePlayer(player);
        tileModel.updateTile(curTile);
        unlockGame(game_state);

        const playerInstructions = player.name + ' purchased ' + curTile.name + ' for $' + curTile.property_cost + '.';

        return {
            function: 'propertyPurchased',
            payload: {
                players: await playerModel.getPlayers(),
                tileOwner: player,
                playerInstructions: playerInstructions
            }
        };
    },

    doTurn: async function (player) {
        let game_state = await getGameState();
        const turnError = canDoTurn(game_state, player);

        if (turnError) {
            return { function: 'error', payload: { text: turnError } };
        }

        const rolls = rollDice();
        player = newPlayerPos(player, rolls);

        const curTile = await tileModel.getTile(player.position);
        let playerInstructions = curTile.description;

        if (curTile.owner) {
            playerInstructions = await hasTileOwner(player, curTile);
            game_state = await nextPlayerTurn(game_state);
        }
        else if (curTile.type === 'property' && player.money >= curTile.property_cost) {
            playerInstructions = 'Purchase ' + curTile.name + ' for $' + curTile.property_cost + '?';
            game_state.paused = true; // Don't let the next person go if it's a property, we need to receive a response first
        }
        else {
            player.money -= curTile.money_lost;
            game_state = await nextPlayerTurn(game_state);
        }

        await playerModel.updatePlayer(player);

        return {
            function: 'doTurn',
            payload: {
                players: await playerModel.getPlayers(),
                rolls: rolls,
                playerInstructions: playerInstructions
            }
        };
    }
};