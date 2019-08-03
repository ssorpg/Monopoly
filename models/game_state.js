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
    await knex('game_state').update(game_state);
}

function checkTurn(game_state, player) {
    // if (process.env.NODE_ENV) {
    //     return false;
    // }

    if (player.player_number !== game_state.current_player_turn) {
        return false;
    }

    return true;
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

async function newPlayerTurn(game_state, players) {
    players = players || await playerModel.getPlayers(); // If players provided, no need to spend time getting from DB
    let numPlayers = players.length;

    if (numPlayers < 2) {
        numPlayers = 2;
    }

    game_state.current_player_turn = game_state.current_player_turn % numPlayers;
    game_state.current_player_turn++;

    return game_state;
}

async function checkGameInProgress(game_state) {
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



// EXPORTS
module.exports = {
    getGameState: getGameState,
    updateGameState: updateGameState,
    checkLosers: checkLosers,

    purchaseProperty: async function (player) {
        let game_state = await getGameState();
        const isTurn = checkTurn(game_state, player);
        const curTile = await tileModel.getTile(player.position);

        if (!isTurn) {
            return { function: 'error', payload: { text: 'It\'s not your turn.' } };
        }
        else if (player.money < curTile.property_cost) {
            return { function: 'messageError', payload: { text: 'The game is currently paused.' } };
        }

        player.money -= curTile.property_cost;
        curTile.owner = player.name;

        game_state = newPlayerTurn(game_state);
        game_state.paused = false;

        playerModel.updatePlayer(player);
        tileModel.updateTile(curTile);
        updateGameState(game_state);

        const playerInstructions = player.name + ' purchased ' + curTile.name + ' for ' + curTile.property_cost + '.';

        return {
            function: 'propertyPurchased',
            payload: {
                player: player,
                tileOwner: player,
                playerInstructions: playerInstructions
            }
        };
    },

    doTurn: async function (player) {
        let game_state = await getGameState();
        const isTurn = checkTurn(game_state, player);

        if (!isTurn) {
            return { function: 'error', payload: { text: 'It\'s not your turn.' } };
        }
        else if (game_state.paused) {
            return { function: 'error', payload: { text: 'The game is currently paused.' } };
        }

        const rolls = rollDice();
        player = newPlayerPos(player, rolls);

        const curTile = await tileModel.getTile(player.position);
        let playerInstructions = curTile.description;
        let tileOwner = await playerModel.getPlayer(curTile.owner);

        if (tileOwner) {
            player.money -= curTile.property_cost / 2;
            tileOwner.money += curTile.property_cost / 2;

            playerModel.updatePlayer(tileOwner);
        }
        else if (curTile.type === 'property') {
            playerInstructions = tileModel.askToBuy(curTile);
            game_state.paused = true; // Don't let the next person go if it's a property, we need to receive a response first
        }
        else {
            player.money -= curTile.money_lost;
            game_state = newPlayerTurn(game_state);
        }

        playerModel.updatePlayer(player);
        game_state = checkGameInProgress(game_state); // This is checked in api routes so players won't be able to login
        updateGameState(game_state);

        return {
            function: 'setRoll',
            payload: {
                player: player,
                tileOwner: tileOwner,
                rolls: rolls,
                playerInstructions: playerInstructions
            }
        };
    },
};