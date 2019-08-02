// DOTENV FOR DEBUG
require('dotenv').config();



// MODELS
const knex = require('../config/connection');
const playerModel = require('./player');
const tileModel = require('./tile');



// FUNCTIONS
async function getGameState() {
    const [game_state] = await knex('game_state').select('*');

    return game_state;
}

function checkTurn(game_state, player) {
    // console.log(game_state);

    if (player.player_number !== game_state.current_player_turn && process.env.NODE_ENV) {
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

function updatePlayerPos(player, rolls) {
    const dieSum = rolls.die1 + rolls.die2;

    if (player.position + dieSum > 24) {
        player.money += 200;
    }

    player.position = (player.position + dieSum) % 24;
    
    return player;
}

function updatePlayerMoney(player, curTile) {
    player.money += curTile.money_gained;
    player.money -= curTile.money_lost;

    return player;
}

async function updateCurPlayerTurn(game_state) {
    const players = await playerModel.getPlayers();
    let numPlayers = players.length;

    if (numPlayers < 2) {
        numPlayers = 2;
    }

    game_state.current_player_turn = game_state.current_player_turn % numPlayers;
    game_state.current_player_turn++;

    await knex('game_state').update(game_state);
}

async function checkGameInProgress(game_state) {
    if (!game_state.in_progress && game_state.current_player_turn === 3) {
        game_state.in_progress = true;
    }

    await knex('game_state').update(game_state);
}



// EXPORTS
module.exports = {
    getGameState: getGameState,
    
    doTurn: async function (player) {
        const game_state = await getGameState();
        const isTurn = checkTurn(game_state, player);
        
        if (!isTurn) {
            return { function: 'wait' };
        }

        const rolls = rollDice();
        player = updatePlayerPos(player, rolls);

        const curTile = await tileModel.getTile(player.position);
        player = updatePlayerMoney(player, curTile);

        playerModel.updatePlayer(player);
        updateCurPlayerTurn(game_state);
        checkGameInProgress(game_state);

        return {
            function: 'setRoll',
            payload: {
                player: player,
                rolls: rolls,
                tile: {
                    description: curTile.description
                }
            }
        };
    },

    updateCurPlayerTurn: updateCurPlayerTurn
};