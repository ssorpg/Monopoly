// MODELS
const knex = require('../config/connection');
const playerModel = require('./player');
const spaceModel = require('./space');



// FUNCTIONS
async function getGameState() {
    const [game_state] = await knex('game_state').select('*');

    return game_state;
}

function checkTurn(game_state, player) {
    console.log(game_state);

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

function updatePlayerPosition(player, rolls) {
    const dieSum = rolls.die1 + rolls.die2;
    
    player.position = (player.position + dieSum) % 24;

    return player;
}

async function updatePlayerMoney(player) {
    const curSpace = await spaceModel.getSpace(player.position);
        
    player.money += curSpace.money_gained;
    player.money -= curSpace.money_lost;

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

        player = updatePlayerPosition(player, rolls);
        player = await updatePlayerMoney(player);

        playerModel.updatePlayer(player);
        await updateCurPlayerTurn(game_state);

        return {
            function: 'setRoll',
            payload: {
                player: player,
                rolls: rolls
            }
        };
    },

    updateCurPlayerTurn: updateCurPlayerTurn
};