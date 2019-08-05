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
    // console.log(game_state);
    await knex('game_state').update(game_state).where('id', game_state.id);
}

function isTurn(game_state, player) {
    if (player.player_number !== game_state.current_player_turn) {
        return 'It\'s not your turn.';
    }
}

function canDoTurn(game_state, player) {
    // if (!process.env.NODE_ENV) {
    //     return;
    // }

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

async function newPlayerPos(player, rolls) {
    const dieSum = rolls.die1 + rolls.die2;

    if (player.position + dieSum >= 24) { // Passed GO
        player.money += 100;
    }

    player.position = (player.position + dieSum) % 24;

    await playerModel.updatePlayer(player);
}

async function nextPlayerTurn(game_state, players) {
    // if (!process.env.NODE_ENV) {
    //     return game_state;
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

function checkGameInProgress(game_state, player) {
    if (!game_state.in_progress && player.player_number === 2) {
        game_state.in_progress = true; // Player 2 took their first turn so the game is now in progress
    }

    return game_state;
}

async function unlockGame(game_state) {
    game_state = await nextPlayerTurn(game_state);
    game_state.paused = false;

    updateGameState(game_state);
}

async function hasTileOwner(player, curTile) {
    let tileOwner = {
        name: curTile.owner
    };

    if (tileOwner.name === player.name) {
        return;
    }

    tileOwner = await playerModel.getPlayer(tileOwner);

    const moneyExchanged = curTile.property_cost / 2;

    player.money -= moneyExchanged;
    tileOwner.money += moneyExchanged;

    console.log(tileOwner);

    await playerModel.updatePlayer(player);
    await playerModel.updatePlayer(tileOwner);

    return player.name + ' paid $' + moneyExchanged + ' in rent to ' + tileOwner.name + '.';
}

// EXPORTS
module.exports = {
    getGameState: getGameState,
    updateGameState: updateGameState,
    nextPlayerTurn: nextPlayerTurn,

    doTurn: async function (player) {
        let game_state = await getGameState();
        const turnError = canDoTurn(game_state, player);

        if (turnError) {
            return { function: 'error', payload: { text: turnError } };
        }

        const rolls = rollDice();
        await newPlayerPos(player, rolls);

        const curTile = await tileModel.getTile(player.position);
        let playerInstructions = curTile.description;

        if (curTile.owner) {
            playerInstructions = await hasTileOwner(player, curTile) || '';
            game_state = await nextPlayerTurn(game_state);
        }
        else if (curTile.type === 'property' && player.money >= curTile.property_cost) {
            playerInstructions = 'Purchase ' + curTile.name + ' for $' + curTile.property_cost + '?';
            game_state.paused = true; // Don't let the next person go if it's a property, we need to receive a response first
        }
        else {
            player.money -= curTile.money_lost;
            await playerModel.updatePlayer(player);
            game_state = await nextPlayerTurn(game_state);
        }

        game_state = checkGameInProgress(game_state, player);
        updateGameState(game_state);

        if (player.money <= 0) {
            return {
                function: 'lose',
                payload: {
                    playerInstructions: playerInstructions += ' This caused ' + player.name + ' to go bankrupt!'
                }
            };
        }

        return {
            function: 'doTurn',
            payload: {
                players: await playerModel.getPlayers(),
                rolls: rolls,
                playerInstructions: playerInstructions,
                currentPlayerTurn: game_state.current_player_turn
            }
        };
    },

    purchaseProperty: async function (player) {
        const game_state = await getGameState();
        const notTurn = isTurn(game_state, player);
        const curTile = await tileModel.getTile(player.position);

        if (notTurn) {
            return { function: 'error', payload: { text: notTurn } };
        }
        else if (!game_state.paused) {
            return { function: 'error', payload: { text: 'You haven\'t rolled yet.' } };
        }
        else if (curTile.owner) {
            return { function: 'error', payload: { text: 'You can\'t purchase an owned tile.' } };
        }

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
                playerInstructions: playerInstructions,
                currentPlayerTurn: game_state.current_player_turn
            }
        };
    },

    passProperty: async function (player) {
        let game_state = await getGameState();
        const notTurn = isTurn(game_state, player);
        const curTile = await tileModel.getTile(player.position);

        if (notTurn) {
            return { function: 'error', payload: { text: notTurn } };
        }
        else if (!game_state.paused) {
            return { function: 'error', payload: { text: 'You haven\'t rolled yet.' } };
        }

        game_state = await nextPlayerTurn(game_state);
        game_state.paused = false;

        updateGameState(game_state);

        return {
            function: 'propertyPassed',
            payload: {
                playerInstructions: player.name + ' decided not to purchase ' + curTile.name + '.',
                currentPlayerTurn: game_state.current_player_turn
            }
        };
    },

    checkTurnOnPlayerLose: async function (player, players, game_state) {
        if (!game_state.in_progress && game_state.current_player_turn === 1) { // No need to increment turns if no one's taken any
            return;
        }

        if (player.player_number === game_state.current_player_turn) { // If it was their turn...
            if (player.player_number === players.length) {  // And they were in last position...
                game_state = await nextPlayerTurn(game_state, players); // Player 1 gets to go
                updateGameState(game_state);
            }
        }
        else { // If it wasn't their turn...
            if (player.player_number < game_state.current_player_turn) { // And they go before the person whose turn it is...
                game_state.current_player_turn -= 2; // -1 for upCurPlayerTurn++ and -1 for reNumbering players
                game_state = await nextPlayerTurn(game_state, players);
                updateGameState(game_state);
            }
        }

        console.log('');
        console.log(game_state);
    },

    restart: async function () {
        await knex('players').truncate();
        await knex('tiles').update({ owner: null });
        await knex('game_state').update({ current_player_turn: 1, in_progress: false, paused: false });
    }
};